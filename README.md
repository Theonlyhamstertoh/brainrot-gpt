# Bluon AI Documentation

This is the code repository for **Bluon AI MasterMechanic**. Files in the repository have been updated with their description at the top. Below are the directory folder structure

The project is built with:

```md
NextJS
React
TailwindCSS
Typescript
OpenAI-Edge
Vercel/ai
pnpm
```

## Folder Structure

### Directory

<!-- prettier-ignore -->
```md
.
├── app           # Pages & API Files
├── components  
├── hooks  
├── lib           # constants, utilities, prompts
├── public        # image assets
├── types  
├── env           # project env variables
```

### App Folder

<!-- prettier-ignore -->
```md
.
├── ...
├── app  
│ ├── page.tsx        # AI Chatbot page
│ ├── about  
│ │    ├─ page.tsx    # about page
│ ├── api        
│ │    ├─ airtable    # API to log into airtable
│ │    ├─ chat        # API for generating AI response
│ ├── layout.tsx      # Layout for every page
│ └── ... # etc.
└── ...
```

### Components Folder

<!-- prettier-ignore -->
```md
.
├── ...
├── components  
│ ├── Chat
│ ├── Feedback        # UI for feedback components
│ ├── Lottie          # Animations
│ ├── PromptForm      # UI & logic for input prompt
│ ├── Response        # UI for chat messages
│ └── ... # etc.
└── ...
```

### To clone this project

```bash
git clone git@github.com:bionatus/bluonai.git
cd bluonai
pnpm install
pnpm dev
```

# API

## Get All `User` queries by `user_id=Integer`

#### Request: `https://www.bluon.ai/api/v1/posts?user_id=1`

```json
{
  "user_id": "1",
  "company_id": null,
  "start_date": null,
  "end_date": null,
  "results": [
    { "query": "testing", "created_at": "2023-12-13T00:00:57.071Z" },
    { "query": "how are you today", "created_at": "2023-12-13T00:01:02.225Z" },
    {
      "query": "do you want some pineapples?",
      "created_at": "2023-12-13T00:01:07.547Z"
    }
  ]
}
```

## Get All `User` queries with `start_date=YYYY-MM-DD` and/or `end_date=YYYY-MM-DD` by `user_id` & `start_date` & `end_date`

Request: `https://www.bluon.ai/api/v1/posts?user_id=1&start_date=2023-10-12
end_date=2023-10-14`

```json
{
  "user_id": "1",
  "company_id": null,
  "start_date": "2023-10-12",
  "end_date": "2023-10-14",
  "results": [
    { "query": "testing", "created_at": "2023-12-13T00:00:57.071Z" },
    { "query": "how are you today", "created_at": "2023-12-13T00:01:02.225Z" },
    {
      "query": "do you want some pineapples?",
      "created_at": "2023-12-13T00:01:07.547Z"
    }
  ]
}
```

## Get All `Company` queries by `company_id=UUID`

#### Request: `https://www.bluon.ai/api/v1/posts?company_id=f50c2db8-6103-4cc1-869f-8d0adb53b655`

```json
{
  "user_id": null,
  "company_id": "f50c2db8-6103-4cc1-869f-8d0adb53b655",
  "start_date": null,
  "end_date": null,
  "results": [
    {
      "query": "How to install upblast exhaust fan ",
      "created_at": "2024-03-14T03:10:29.653Z"
    }
  ]
}
```

## Get All `Company` queries with `start_date=YYYY-MM-DD` and/or `end_date=YYYY-MM-DD` by `company_id` & `start_date` & `end_date`

Request: `https://www.bluon.ai/api/v1/posts?company_id=f50c2db8-6103-4cc1-869f-8d0adb53b655&start_date=2024-03-12&end_date=2024-03-12`

Response

```json
{
  "user_id": null,
  "company_id": "f50c2db8-6103-4cc1-869f-8d0adb53b655",
  "start_date": "2024-03-12",
  "end_date": "2024-03-12",
  "results": [
    {
      "query": "How to install upblast exhaust fan ",
      "created_at": "2024-03-14T03:10:29.653Z"
    }
  ]
}
```

## Get All `User` queries from `Company` withby including both `company_id` `user_id`

Request: `https://www.bluon.ai/api/v1/posts?company_id=UUID&user_id=integer`

```json
{
  "user_id": "1",
  "company_id": "f50c2db8-6103-4cc1-869f-8d0adb53b655&",
  "start_date": null,
  "end_date": null,
  "results": [
    { "query": "testing", "created_at": "2023-12-13T00:00:57.071Z" },
    { "query": "how are you today", "created_at": "2023-12-13T00:01:02.225Z" },
    {
      "query": "do you want some pineapples?",
      "created_at": "2023-12-13T00:01:07.547Z"
    }
  ]
}
```

## Get supplier questions

Get all questions asked by a specific Supplier: `https://www.bluon.ai/api/v1/posts?supplier_id=8394`

Example response:

```
{
    "supplier_id": "8394",
    "company_id": null,
    "start_date": null,
    "end_date": null,
    "results": [
        { "query": "testing", "created_at": "2023-12-13T00:00:57.071Z" },
        { "query": "how are you today", "created_at": "2023-12-13T00:01:02.225Z" },
        { "query": "do you want some pineapples?", "created_at": "2023-12-13T00:01:07.547Z" }
    ]
}
```

## Generate Summaries

For use in B4B Admin dashboard

This generates the text for the report used in B4B dashboard. It works by fetching all questions asked by a given companyID, then sending that to the AI within a prompt to identify the additional training needed based on the questions asked. Changing the AI prompt will change the focus of the report.

`https://www.bluon.ai/api/v1/summary?company_id=2c5dc032-7dec-4b14-b571-73f2645e9f8a&start_date=2024-01-01&end_date=2024-01-02`

Example response:

```
{
  "user_id": null,
  "company_id": "2c5dc032-7dec-4b14-b571-73f2645e9f8a",
  "total_questions": "2",
  "unique_users": "1",
  "start_date": "2024-01-01",
  "end_date": "2024-01-02",
  "summary":"Here's how your team is using MasterMechanic:\n\n1. Troubleshooting techniques: Understanding how to diagnose and troubleshoot various HVAC system issues effectively.\n2. Advanced refrigeration technology: Training on the latest refrigerants, refrigeration equipment, and best practices for refrigeration system maintenance and repair.\n3. Energy-efficient HVAC systems: Learning about the latest energy-efficient technologies and practices for reducing energy consumption in HVAC systems.\n"
}
```
