# ✨ HacktoberShield: SpamBuster for PRs 🛡️ [WIP]

![GitHub release (latest by date)](https://img.shields.io/github/v/release/velocitatem/hacktobershield)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-Friendly-orange.svg)

---

🚀 **HacktoberShield** is a 🔥 super-charged GitHub Action designed to protect your project during Hacktoberfest 🎃. It uses the power of OpenAI GPT 🤖 to evaluate incoming Pull Requests and keep spam away! 🚫

## 🌟 Features

- 🔍 **Identifies Changed Files**: Never miss what has been altered in a PR.
- 📋 **Runs Diff Checks**: Get the full picture of every change.
- 🧠 **Evaluates Using OpenAI GPT**: Leveraging machine learning for accurate evaluations.
- 🚩 **Flags Suspected Spam**: Keeps your repo clean and pristine.

## 🚀 Quick Start

1️⃣ Create a `.github/workflows/hacktobershield.yml` file in your repository with:

```yaml
name: HacktoberShield
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  hacktoberShieldJob:
    runs-on: ubuntu-latest
    steps:
      - name: Use HacktoberShield Action
        uses: velocitatem/HacktoberShield@main  # or specify a tag version instead of "main"
        with:
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}

  comment:
    needs: hacktoberShieldJob
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Comment on PR
        uses: mshick/add-pr-comment@v2
        with:
          message: "SPAM ANALYSIS COMPLETED\nREPORT:"
```

2️⃣ Add the action steps to the YAML.

## 📋 Requirements

- 🌐 GitHub Actions enabled on your GitHub repository.
- 🔑 OpenAI API Key for the magic 🎩.

## 🛠️ Setup

### 🌐 Environment Variables

- `OPENAI_API_KEY`: 🗝️ Your OpenAI API key.

🔒 Add this environment variable to your repository secrets.

### 🚀 Usage

Simply insert the action in your `.github/workflows/hacktobershield.yml` as demonstrated in the 🚀 Quick Start section.

## 📜 License

📗 MIT License. Please see the `LICENSE` file for more information.
