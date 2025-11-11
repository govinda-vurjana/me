import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Calculate the path to the .env file in the project root
const envPath = path.resolve(process.cwd(), '../../../.env');
console.log(`🔍 Looking for .env file at: ${envPath}`);

// Load environment variables from .env file
try {
    dotenv.config({ path: envPath });
    console.log('✅ Successfully loaded .env file');
    
    // Debug: Log available environment variables (without sensitive data)
    console.log('Environment variables loaded:', {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN ? '*** (exists)' : '❌ missing',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '*** (exists)' : '❌ missing'
    });
} catch (error) {
    console.error('❌ Error loading .env file:', error.message);
    process.exit(1);
}

// Verify OpenAI API key is available
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY is not set in .env file');
    console.error('Please make sure your .env file is in the project root and contains:');
    console.error('OPENAI_API_KEY=your_openai_api_key_here');
    process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY.trim() // Trim any whitespace
});

console.log('🔑 OpenAI client initialized');

// Configuration
const CONFIG = {
    GITHUB_USERNAME: 'govinda-vurjana',
    OUTPUT_FILE: path.join(__dirname, '../../data/portfolio.json'),
    // Add repository names to exclude (case-sensitive)
    EXCLUDE_REPOS: [
        'govinda-vurjana',  // GitHub profile README
        'me',  
        'TED',
        'ABCXYZ',
        'XYZ',
        ''            // Current portfolio website
       
    ],
    // Set to false to disable AI enhancements
    USE_AI: true,
    INCLUDE_FORKS: false,  // Set to true to include forked repositories
    MAX_REPOS: 20,        // Maximum number of repositories to process
    PORTFOLIO_CATEGORIES: [
        'machine-learning', 'reinforcement-learning', 'web-development',
        'data-science', 'ai', 'python', 'javascript', 'research'
    ]
};

// Initialize GitHub client
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN || '',
    userAgent: 'GitHub Portfolio Generator v1.0.0'
});

async function fetchRepositories() {
    try {
        const { data: repos } = await octokit.repos.listForUser({
            username: CONFIG.GITHUB_USERNAME,
            sort: 'updated',
            direction: 'desc',
            per_page: 30
        });

        return repos
            .filter(repo => !repo.private)
            .filter(repo => CONFIG.INCLUDE_FORKS ? true : !repo.fork)
            .filter(repo => !CONFIG.EXCLUDE_REPOS.includes(repo.name))
            .slice(0, CONFIG.MAX_REPOS);
    } catch (error) {
        console.error('Error fetching repositories:', error.message);
        return [];
    }
}

async function fetchReadme(repo) {
    try {
        console.log(`Fetching README for ${repo.name}...`);
        const { data } = await octokit.repos.getReadme({
            owner: CONFIG.GITHUB_USERNAME,
            repo: repo.name,
            headers: {
                accept: 'application/vnd.github.v3.raw'
            }
        });
        
        // If we get here, we have the README content directly
        console.log(`✅ Found README for ${repo.name}`);
        return data;
    } catch (error) {
        if (error.status === 404) {
            console.log(`❌ No README found for ${repo.name} (404)`);
        } else if (error.status === 403) {
            console.log(`❌ Rate limit or permissions issue for ${repo.name}`);
            console.log('GitHub API Response:', error.response?.data || error.message);
        } else {
            console.log(`❌ Error fetching README for ${repo.name}:`, error.message);
        }
        return null;
    }
}

function extractTechStack(repo) {
    const tech = [];
    
    // Add language if available
    if (repo.language) {
        tech.push(repo.language);
    }
    
    // Add topics if available
    if (repo.topics && repo.topics.length > 0) {
        tech.push(...repo.topics);
    }
    
    return [...new Set(tech)].filter(Boolean).join(', ');
}

function determineCategory(repo) {
    const lowerName = repo.name.toLowerCase();
    const lowerDesc = (repo.description || '').toLowerCase();
    
    // Check for RL/ML projects
    if (lowerName.includes('rl-') || lowerDesc.includes('reinforcement') || 
        lowerDesc.includes('machine learning') || lowerDesc.includes('deep learning')) {
        return 'Reinforcement Learning';
    }
    
    // Check for web projects
    if (lowerName.includes('web-') || lowerName.includes('site') || 
        lowerDesc.includes('web') || lowerDesc.includes('react') || 
        lowerDesc.includes('vue') || lowerDesc.includes('next')) {
        return 'Web Development';
    }
    
    return 'Other';
}

async function generateWithAI(repo, readme) {
    if (!CONFIG.USE_AI || !process.env.OPENAI_API_KEY) {
        return null;
    }

    try {
        console.log(`\n📝 Analyzing ${repo.name} with AI...`);
        
        const prompt = `Given the following GitHub repository information, generate a concise project description and extract key technologies used.

Repository: ${repo.name}
Description: ${repo.description || 'No description'}

README Content:
${readme ? readme.substring(0, 4000) : 'No README content available'}

IMPORTANT: Respond with a valid JSON object containing these exact fields:
{
  "description": "A concise project description (2-3 sentences)",
  "technologies": ["list", "of", "technologies"],
  "category": "most relevant category"
}

DO NOT include any markdown formatting (no backticks, no json tags), just the raw JSON object.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that analyzes GitHub repositories and extracts key information for a portfolio website. Be concise and professional. ALWAYS respond with valid JSON format as specified in the prompt."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 500,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        
        if (!content) {
            console.log('❌ No content in AI response');
            return null;
        }

        try {
            // Clean the response - remove markdown code blocks if present
            let cleanContent = content
                .replace(/```json\n?|```/g, '')  // Remove ```json and ```
                .replace(/^\s*[\r\n]+/gm, '')  // Remove empty lines
                .trim();

            // Parse the cleaned content
            const result = JSON.parse(cleanContent);
            console.log('✅ AI analysis successful');
            return result;
            
        } catch (e) {
            console.error('❌ Error parsing AI response:', e.message);
            console.log('Raw AI response:', content);
            return null;
        }
    } catch (error) {
        console.error('❌ Error generating with AI:', error.message);
        return null;
    }
}

// Maximum length for the description before adding 'Read more'
const MAX_DESCRIPTION_LENGTH = 150;

async function generatePortfolio() {
    console.log('Fetching GitHub repositories...');
    const repos = await fetchRepositories();
    
    console.log(`Processing ${repos.length} repositories...`);
    const portfolioItems = [];
    
    for (const repo of repos) {
        console.log(`\n---\nProcessing: ${repo.name}`);
        
        // Skip if no README found
        const readme = await fetchReadme(repo);
        if (!readme) {
            console.log(`❌ Skipping ${repo.name} - No README found`);
            continue;
        }
        
        // Get AI-enhanced data if enabled
        let aiData = {};
        if (CONFIG.USE_AI && process.env.OPENAI_API_KEY) {
            console.log(`Enhancing ${repo.name} with AI...`);
            aiData = await generateWithAI(repo, readme) || {};
        }
        
        // Format description with 'Read more' link if needed
        let description = aiData.description || repo.description || 'No description provided.';
        if (description.length > MAX_DESCRIPTION_LENGTH) {
            description = `${description.substring(0, MAX_DESCRIPTION_LENGTH).trim()}... <a href="${repo.html_url}#readme" style="color: #4CAF50; text-decoration: underline;">Read more</a>`;
        }
        
        const portfolioItem = {
            title: repo.name.replace(/-/g, ' ').replace(/(^|\s)\S/g, t => t.toUpperCase()),
            description: description,
            technologies: aiData.technologies ? aiData.technologies.join(', ') : extractTechStack(repo),
            category: aiData.category || determineCategory(repo),
            image: null, // You can add images manually later
            url: repo.homepage || repo.html_url,
            github: repo.html_url,
            date: repo.updated_at.split('T')[0] // Just the date part
        };
        
        portfolioItems.push(portfolioItem);
        console.log(`✅ Added ${repo.name} to portfolio`);
    }
    
    // Sort by date (newest first)
    portfolioItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Save to file (overwrite existing)
    try {
        // Create directory if it doesn't exist
        await fs.promises.mkdir(path.dirname(CONFIG.OUTPUT_FILE), { recursive: true });
        
        // Write the file with pretty-printed JSON
        await fs.promises.writeFile(
            CONFIG.OUTPUT_FILE,
            JSON.stringify(portfolioItems, null, 2),
            'utf-8'
        );
        
        console.log(`\n🎉 Portfolio generated successfully!`);
        console.log(`📂 ${portfolioItems.length} projects included`);
        console.log(`📄 Saved to: ${CONFIG.OUTPUT_FILE}`);
        
    } catch (error) {
        console.error('❌ Error writing portfolio file:', error.message);
        if (error.code === 'ENOENT') {
            console.error('Please ensure the output directory exists and is writable.');
        }
    }
}

// Generate the portfolio
generatePortfolio().catch(console.error);
