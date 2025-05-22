#!/bin/bash

############################################################ [ VARIABLES ]
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m"
##########################################################################


########################################################### [ STEP MODEL ]
print_step() {
  local step_msg="$1"

  echo ""
  echo -e "${YELLOW}/********************************************************/"
  echo ""
  echo -e "${YELLOW}${step_msg}"
  echo ""
  echo -e "${YELLOW}/********************************************************/${NC}"
  echo ""
}
##########################################################################


############################################################### [ STEP 1 ]
print_step "📘 Step 1 : Is the README.md file up to date ?"

read -p "👉 Have you updated the README if necessary ? ( yes / no ) : " answer

case "$answer" in
  yes) ;;
  no)
    echo -e "❌ ${RED}Please update the README before continuing. Aborting."
    exit 1
    ;;
  *)
    echo -e "❌ ${RED}Invalid input. Please answer 'yes' or 'no'. Aborting."
    exit 1
    ;;
esac
##########################################################################


############################################################### [ STEP 2 ]
print_step "🔍  Step 2 : Running security audit..."

npm audit --omit=dev --audit-level high || { echo -e "❌ ${RED}Audit failed. Aborting."; exit 1; }

echo ""
echo -e "✅ ${GREEN}No production vulnerabilities found, move to next step..."
##########################################################################


############################################################### [ STEP 3 ]
print_step "🧹  Step 3 : Running linter..."

npm run lint || { echo -e "❌ ${RED}Lint failed. Aborting."; exit 1; }

echo -e "✅ ${GREEN}Lint passed without errors, move to next step..."
##########################################################################


############################################################### [ STEP 4 ]
print_step "🏗️  Step 4 : Building the project..."

npm run build || { echo -e "❌ ${RED}Build failed. Aborting."; exit 1; }

echo ""
echo -e "✅ ${GREEN}Build completed successfully, move to next step..."
##########################################################################


############################################################### [ STEP 5 ]
print_step "🐳 Step 5 : Building Docker image..."

read -p "👉 Please enter an image name : " input_image_name

if [ -z "$input_image_name" ]; then
  echo -e "❌ ${RED}Empty image name entered. Aborting."
  exit 1
fi

echo ""
docker build --no-cache -t "$input_image_name" . || {
  echo -e "❌ ${RED}Docker build failed. Aborting."
  exit 1
}

echo ""
echo -e "✅ ${GREEN}Docker image '$input_image_name' built successfully, move to next step..."
##########################################################################


############################################################# [ STEP 5.5 ]
print_step "📤 Step 5.5 ( optional ) : Pushing Docker image..."

read -p "👉 Do you want to push the image to Docker Hub ? ( yes / no ) : " push_answer

case "$push_answer" in
  yes)
    echo ""
    read -p "🔐 Please enter your Docker username : " docker_username
    echo ""

    docker login || {
      echo -e "❌ ${RED}Docker login failed. Aborting."
      exit 1
    }

    echo ""
    read -p "👉 Please enter an image tag ( optional ) : " input_image_tag
    echo ""

    if [ -z "$input_image_tag" ]; then
      input_image_tag="latest"
    fi

    docker tag "$input_image_name" "$docker_username/$input_image_name:$input_image_tag"

    docker push "$docker_username/$input_image_name:$input_image_tag" || {
      echo -e "❌ ${RED}Failed to push image to Docker Hub. Aborting."
      exit 1
    }

    echo ""
    echo -e "✅ ${GREEN}Docker image successfully pushed as '$docker_username/$input_image_name:$input_image_tag', move to next step..."
    ;;
  no)
    echo ""
    echo -e "${GREEN}Push skipped, move to next step..."
    ;;
  *)
    echo -e "❌ ${RED}Invalid input. Please answer 'yes' or 'no'. Aborting."
    exit 1
    ;;
esac
##########################################################################


############################################################### [ STEP 6 ]
print_step "📦 Step 6 : Choose version bump type"

echo -e "   ${GREEN}[p] patch ( bug fixes )${NC}"
echo -e "   ${YELLOW}[m] minor ( backward-compatible features )${NC}"
echo -e "   ${RED}[M] major ( breaking changes )${NC}"

echo ""
printf "👉 Your choice ( ${GREEN}p${NC} / ${YELLOW}m${NC} / ${RED}M${NC} ) : "
read choice

case "$choice" in
  p) bump="patch" ;;
  m) bump="minor" ;;
  M) bump="major" ;;
  *) echo -e "❌ ${RED}Invalid choice. Aborting."; exit 1 ;;
esac

echo ""
echo "🔢 Bumping version with "npm version $bump"..."

npm version $bump --no-git-tag-version || { echo -e "❌ ${RED}Version bump failed. Aborting."; exit 1; }

echo ""
echo -e "✅ ${GREEN}Version bumped successfully, move to next step..."
##########################################################################


############################################################### [ STEP 7 ]
print_step "🛑 Step 7 : Manually stage the files you want to commit"

echo "👉 Use "git add ..." for precise control"
echo ""
read -p "Press [ Enter ] when you're ready to continue..."

if [[ -z $(git diff --cached --name-only) ]];
then
  echo -e "❌ ${RED}No files staged. Aborting commit."
  exit 1
fi
##########################################################################


############################################################### [ STEP 8 ]
print_step "💬 Step 8 : Write your commit message"

read -p "Commit message: " message
echo ""
git commit -m "$message"

version=$(node -p "require('./package.json').version")
git tag "v$version"

echo ""
echo -e "${GREEN}🏷️  Tagged commit with 'v$version'${NC}"

echo ""
echo -e "✅ ${GREEN}All done !"
##########################################################################