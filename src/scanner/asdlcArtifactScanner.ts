// ASDLC Artifact Scanner - Scan for explicit ASDLC artifacts (AGENTS.md, specs/, schemas/)
// See: specs/scanners/spec.md for architecture and contracts
import * as vscode from 'vscode';
import {
	AgentsMdInfo,
	AgentsMdSection,
	TechStackInfo,
	OperationalBoundaries,
	SpecsInfo,
	SpecFile,
	SchemasInfo,
	SchemaFile,
	AsdlcArtifacts
} from './types';

/**
 * Scanner for ASDLC artifacts (AGENTS.md, specs/, schemas/)
 *
 * Replaces optimistic state detection with explicit artifact scanning.
 * Only scans artifacts that developers intentionally create and maintain.
 *
 * @see specs/scanners/spec.md for architecture and contracts
 */
export class AsdlcArtifactScanner {
	constructor(private workspaceRoot: vscode.Uri) {}

	/**
	 * Scan all ASDLC artifacts in the workspace
	 * @returns Combined results from all artifact scans
	 */
	async scanAll(): Promise<AsdlcArtifacts> {
		const [agentsMd, specs, schemas] = await Promise.all([
			this.scanAgentsMd(),
			this.scanSpecs(),
			this.scanSchemas()
		]);

		return {
			agentsMd,
			specs,
			schemas,
			hasAnyArtifacts: agentsMd.exists || specs.exists || schemas.exists
		};
	}

	/**
	 * Scan for AGENTS.md at project root
	 * @returns AGENTS.md information with parsed sections
	 */
	async scanAgentsMd(): Promise<AgentsMdInfo> {
		const agentsMdPath = vscode.Uri.joinPath(this.workspaceRoot, 'AGENTS.md');

		try {
			const stat = await vscode.workspace.fs.stat(agentsMdPath);
			if (stat.type !== vscode.FileType.File) {
				return this.emptyAgentsMdInfo();
			}

			const content = await this.readFile(agentsMdPath);
			return this.parseAgentsMd(content, agentsMdPath.fsPath);
		} catch {
			// File doesn't exist - return empty result (not error)
			return this.emptyAgentsMdInfo();
		}
	}

	/**
	 * Scan specs/ directory for spec.md files
	 * @returns Specs directory information with list of spec files
	 */
	async scanSpecs(): Promise<SpecsInfo> {
		const specsPath = vscode.Uri.joinPath(this.workspaceRoot, 'specs');

		try {
			const stat = await vscode.workspace.fs.stat(specsPath);
			if (stat.type !== vscode.FileType.Directory) {
				return this.emptySpecsInfo();
			}

			const specs = await this.findSpecFiles(specsPath);
			return {
				exists: true,
				path: specsPath.fsPath,
				specs
			};
		} catch {
			// Directory doesn't exist - return empty result (not error)
			return this.emptySpecsInfo();
		}
	}

	/**
	 * Scan schemas/ directory for JSON schema files
	 * @returns Schemas directory information with list of schema files
	 */
	async scanSchemas(): Promise<SchemasInfo> {
		const schemasPath = vscode.Uri.joinPath(this.workspaceRoot, 'schemas');

		try {
			const stat = await vscode.workspace.fs.stat(schemasPath);
			if (stat.type !== vscode.FileType.Directory) {
				return this.emptySchemasInfo();
			}

			const schemas = await this.findSchemaFiles(schemasPath);
			return {
				exists: true,
				path: schemasPath.fsPath,
				schemas
			};
		} catch {
			// Directory doesn't exist - return empty result (not error)
			return this.emptySchemasInfo();
		}
	}

	// =========================================================================
	// AGENTS.md Parsing
	// =========================================================================

	private parseAgentsMd(content: string, path: string): AgentsMdInfo {
		const lines = content.split('\n');
		const sections = this.parseSections(lines);
		const mission = this.extractMission(content);
		const corePhilosophy = this.extractCorePhilosophy(content);
		const techStack = this.extractTechStack(content, sections);
		const operationalBoundaries = this.extractOperationalBoundaries(content, sections);

		return {
			exists: true,
			path,
			mission,
			corePhilosophy,
			sections,
			techStack,
			operationalBoundaries
		};
	}

	private parseSections(lines: string[]): AgentsMdSection[] {
		const sections: AgentsMdSection[] = [];
		let currentSection: AgentsMdSection | null = null;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

			if (headingMatch) {
				// Close previous section
				if (currentSection) {
					currentSection.endLine = i - 1;
					sections.push(currentSection);
				}

				// Start new section
				currentSection = {
					level: headingMatch[1].length,
					title: headingMatch[2].trim(),
					startLine: i,
					endLine: lines.length - 1 // Default to end of file
				};
			}
		}

		// Close final section
		if (currentSection) {
			sections.push(currentSection);
		}

		return sections;
	}

	private extractMission(content: string): string | undefined {
		// Look for mission in blockquote format: > **Project Mission:** ...
		const missionMatch = content.match(/>\s*\*\*Project Mission:\*\*\s*(.+)/);
		if (missionMatch) {
			return missionMatch[1].trim();
		}
		return undefined;
	}

	private extractCorePhilosophy(content: string): string | undefined {
		// Look for philosophy in blockquote format: > **Core Philosophy:** ...
		const philosophyMatch = content.match(/>\s*\*\*Core Philosophy:\*\*\s*(.+)/);
		if (philosophyMatch) {
			return philosophyMatch[1].trim();
		}
		return undefined;
	}

	private extractTechStack(content: string, sections: AgentsMdSection[]): TechStackInfo | undefined {
		// Find the Tech Stack section
		const techStackSection = sections.find(s =>
			s.title.toLowerCase().includes('tech stack') ||
			s.title.toLowerCase().includes('technology')
		);

		if (!techStackSection) {
			return undefined;
		}

		// Find the next h2 section to determine where tech stack section ends
		// (tech stack section contains h3 subsections that we need to include)
		const techStackIdx = sections.indexOf(techStackSection);
		const nextH2Section = sections.slice(techStackIdx + 1).find(s => s.level === 2);

		const lines = content.split('\n');
		const endLine = nextH2Section ? nextH2Section.startLine - 1 : lines.length - 1;
		const sectionContent = lines.slice(techStackSection.startLine, endLine + 1).join('\n');

		return {
			languages: this.extractListItems(sectionContent, 'language'),
			frameworks: this.extractListItems(sectionContent, 'framework'),
			buildTools: this.extractListItems(sectionContent, 'build'),
			testing: this.extractListItems(sectionContent, 'testing'),
			packageManager: this.extractSingleValue(sectionContent, 'package manager')
		};
	}

	private extractOperationalBoundaries(content: string, sections: AgentsMdSection[]): OperationalBoundaries | undefined {
		// Find the Operational Boundaries section
		const boundariesSection = sections.find(s =>
			s.title.toLowerCase().includes('operational boundaries')
		);

		if (!boundariesSection) {
			return undefined;
		}

		// Find the next h2 section to determine where boundaries section ends
		// (boundaries section contains h3 tier subsections that we need to include)
		const boundariesIdx = sections.indexOf(boundariesSection);
		const nextH2Section = sections.slice(boundariesIdx + 1).find(s => s.level === 2);

		const lines = content.split('\n');
		const endLine = nextH2Section ? nextH2Section.startLine - 1 : lines.length - 1;
		const sectionContent = lines.slice(boundariesSection.startLine, endLine + 1).join('\n');

		return {
			tier1Always: this.extractTierItems(sectionContent, 'tier 1', 'always'),
			tier2Ask: this.extractTierItems(sectionContent, 'tier 2', 'ask'),
			tier3Never: this.extractTierItems(sectionContent, 'tier 3', 'never')
		};
	}

	private extractListItems(content: string, keyword: string): string[] {
		const items: string[] = [];
		const regex = new RegExp(`^\\s*-\\s*\\*\\*${keyword}[^*]*\\*\\*[:\\s]*(.+)$`, 'gmi');
		let match;
		while ((match = regex.exec(content)) !== null) {
			items.push(match[1].trim());
		}
		return items;
	}

	private extractSingleValue(content: string, keyword: string): string | undefined {
		const regex = new RegExp(`\\*\\*${keyword}[^*]*\\*\\*[:\\s]*([^\\n]+)`, 'i');
		const match = content.match(regex);
		return match ? match[1].trim() : undefined;
	}

	private extractTierItems(content: string, tierKeyword: string, tierName: string): string[] {
		const items: string[] = [];

		// Find section for this tier
		const tierRegex = new RegExp(`###?\\s*${tierKeyword}[^\\n]*${tierName}[^\\n]*`, 'i');
		const tierMatch = content.match(tierRegex);

		if (!tierMatch) {
			return items;
		}

		// Get content after the tier heading until next heading or end
		const startIndex = content.indexOf(tierMatch[0]) + tierMatch[0].length;
		const nextHeadingMatch = content.slice(startIndex).match(/^#{2,3}\s/m);
		const endIndex = nextHeadingMatch
			? startIndex + content.slice(startIndex).indexOf(nextHeadingMatch[0])
			: content.length;

		const tierContent = content.slice(startIndex, endIndex);

		// Extract bullet points with **ALWAYS**, **ASK**, or **NEVER** patterns
		const bulletRegex = /^\s*-\s*\*\*(ALWAYS|ASK|NEVER)\*\*\s*(.+)$/gm;
		let match;
		while ((match = bulletRegex.exec(tierContent)) !== null) {
			items.push(match[2].trim());
		}

		return items;
	}

	// =========================================================================
	// Specs Scanning
	// =========================================================================

	private async findSpecFiles(specsPath: vscode.Uri): Promise<SpecFile[]> {
		const specs: SpecFile[] = [];

		try {
			const entries = await vscode.workspace.fs.readDirectory(specsPath);

			for (const [name, type] of entries) {
				if (type === vscode.FileType.Directory) {
					// Look for spec.md in each subdirectory
					const specFilePath = vscode.Uri.joinPath(specsPath, name, 'spec.md');
					try {
						const stat = await vscode.workspace.fs.stat(specFilePath);
						if (stat.type === vscode.FileType.File) {
							const content = await this.readFile(specFilePath);
							specs.push({
								domain: name,
								path: specFilePath.fsPath,
								hasBlueprint: this.hasSection(content, 'Blueprint'),
								hasContract: this.hasSection(content, 'Contract'),
								lastModified: new Date(stat.mtime).toISOString()
							});
						}
					} catch {
						// spec.md doesn't exist in this directory - skip
					}
				}
			}
		} catch {
			// Error reading directory - return empty array
		}

		return specs;
	}

	private hasSection(content: string, sectionName: string): boolean {
		const regex = new RegExp(`^##\\s+${sectionName}`, 'mi');
		return regex.test(content);
	}

	// =========================================================================
	// Schemas Scanning
	// =========================================================================

	private async findSchemaFiles(schemasPath: vscode.Uri): Promise<SchemaFile[]> {
		const schemas: SchemaFile[] = [];

		try {
			const entries = await vscode.workspace.fs.readDirectory(schemasPath);

			for (const [name, type] of entries) {
				if (type === vscode.FileType.File && name.endsWith('.json')) {
					const schemaFilePath = vscode.Uri.joinPath(schemasPath, name);
					try {
						const content = await this.readFile(schemaFilePath);
						const schemaId = this.extractSchemaId(content);
						schemas.push({
							name,
							path: schemaFilePath.fsPath,
							schemaId
						});
					} catch {
						// Error reading schema file - add with no schemaId
						schemas.push({
							name,
							path: schemaFilePath.fsPath
						});
					}
				}
			}
		} catch {
			// Error reading directory - return empty array
		}

		return schemas;
	}

	private extractSchemaId(content: string): string | undefined {
		try {
			const json = JSON.parse(content);
			return json.$id || json.id;
		} catch {
			return undefined;
		}
	}

	// =========================================================================
	// Utilities
	// =========================================================================

	private async readFile(uri: vscode.Uri): Promise<string> {
		const content = await vscode.workspace.fs.readFile(uri);
		return Buffer.from(content).toString('utf8');
	}

	private emptyAgentsMdInfo(): AgentsMdInfo {
		return {
			exists: false,
			sections: []
		};
	}

	private emptySpecsInfo(): SpecsInfo {
		return {
			exists: false,
			specs: []
		};
	}

	private emptySchemasInfo(): SchemasInfo {
		return {
			exists: false,
			schemas: []
		};
	}
}
