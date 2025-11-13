#!/bin/bash
# MCP Server Authentication Setup Script
# This script helps you configure environment variables for MCP servers

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}MCP Server Authentication Setup${NC}"
echo -e "${BLUE}================================${NC}\n"

# Detect shell config file
if [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
else
    SHELL_CONFIG="$HOME/.profile"
fi

echo -e "${YELLOW}Detected shell config: ${SHELL_CONFIG}${NC}\n"

# Function to check if environment variable already exists
check_env_var() {
    local var_name=$1
    if grep -q "export ${var_name}=" "$SHELL_CONFIG" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local var_value=$2

    if check_env_var "$var_name"; then
        echo -e "${YELLOW}${var_name} already exists in ${SHELL_CONFIG}${NC}"
        read -p "Do you want to update it? (y/N): " update
        if [[ ! "$update" =~ ^[Yy]$ ]]; then
            return
        fi
        # Remove old entry
        sed -i '' "/export ${var_name}=/d" "$SHELL_CONFIG"
    fi

    echo "export ${var_name}=\"${var_value}\"" >> "$SHELL_CONFIG"
    export "${var_name}=${var_value}"
    echo -e "${GREEN}✓ ${var_name} added to ${SHELL_CONFIG}${NC}"
}

# GitHub Token Setup
echo -e "${BLUE}1. GitHub Authentication${NC}"
echo "Choose an option:"
echo "  a) Use GitHub CLI (recommended)"
echo "  b) Enter Personal Access Token manually"
echo "  s) Skip"
read -p "Your choice (a/b/s): " github_choice

case $github_choice in
    a|A)
        if command -v gh &> /dev/null; then
            echo "Running: gh auth login"
            gh auth login
            echo -e "${GREEN}✓ GitHub authentication completed${NC}\n"
        else
            echo -e "${RED}GitHub CLI not found. Install it with: brew install gh${NC}"
            echo "Or visit: https://cli.github.com/"
            read -p "Enter token manually? (y/N): " manual
            if [[ "$manual" =~ ^[Yy]$ ]]; then
                read -sp "Enter your GitHub token: " github_token
                echo
                add_env_var "GITHUB_TOKEN" "$github_token"
            fi
        fi
        ;;
    b|B)
        echo "Get your token from: https://github.com/settings/tokens"
        echo "Required scopes: repo, workflow, read:org"
        read -sp "Enter your GitHub token: " github_token
        echo
        add_env_var "GITHUB_TOKEN" "$github_token"
        ;;
    *)
        echo -e "${YELLOW}Skipped GitHub setup${NC}\n"
        ;;
esac

# Vercel Token Setup
echo -e "${BLUE}2. Vercel Authentication${NC}"
echo "Choose an option:"
echo "  a) Use Vercel CLI (recommended)"
echo "  b) Enter Access Token manually"
echo "  s) Skip"
read -p "Your choice (a/b/s): " vercel_choice

case $vercel_choice in
    a|A)
        if command -v vercel &> /dev/null; then
            echo "Running: vercel login"
            vercel login
            echo -e "${GREEN}✓ Vercel authentication completed${NC}\n"
        else
            echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
            npm install -g vercel
            vercel login
            echo -e "${GREEN}✓ Vercel authentication completed${NC}\n"
        fi
        ;;
    b|B)
        echo "Get your token from: https://vercel.com/account/tokens"
        read -sp "Enter your Vercel token: " vercel_token
        echo
        add_env_var "VERCEL_TOKEN" "$vercel_token"
        ;;
    *)
        echo -e "${YELLOW}Skipped Vercel setup${NC}\n"
        ;;
esac

# Optional: Heroku
echo -e "${BLUE}3. Heroku API Key (Optional)${NC}"
read -p "Do you want to configure Heroku? (y/N): " heroku_setup
if [[ "$heroku_setup" =~ ^[Yy]$ ]]; then
    echo "Get your API key from: https://dashboard.heroku.com/account"
    read -sp "Enter your Heroku API key: " heroku_key
    echo
    add_env_var "HEROKU_API_KEY" "$heroku_key"
fi

# Optional: Canva
echo -e "${BLUE}4. Canva API Key (Optional)${NC}"
read -p "Do you want to configure Canva? (y/N): " canva_setup
if [[ "$canva_setup" =~ ^[Yy]$ ]]; then
    echo "Get your API key from: https://www.canva.com/developers"
    read -sp "Enter your Canva API key: " canva_key
    echo
    add_env_var "CANVA_API_KEY" "$canva_key"
fi

# Summary
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}\n"

echo "Environment variables have been added to: ${SHELL_CONFIG}"
echo -e "\n${YELLOW}IMPORTANT: To apply changes, run:${NC}"
echo -e "${BLUE}source ${SHELL_CONFIG}${NC}"
echo -e "\nOr restart your terminal.\n"

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run: source ${SHELL_CONFIG}"
echo "2. Restart your IDE completely"
echo "3. MCP servers should now authenticate successfully"
echo ""
echo "For troubleshooting, see: $(pwd)/MCP_SETUP.md"

