#### Note: Spendex is in the MVP stage and actively under development. Upcoming features include duplication detection during transaction import and other enhancements based on user feedback.

# Spendex - Expense Tracker

### Live app: https://spendex.badhon.ca

### Video demo showcasing core features: https://youtu.be/dvYRIoKF2zw

### Screenshots: https://shorturl.at/F5REK

## What is Spendex?

Spendex is an expense tracker application with unique features that distinguish it from others. Rather than relying heavily on AI automation, Spendex focuses on providing customization tools, making it accessible and free for students and professionals. It offers a simple account setup and easy insights into financial data, with a comprehensive dashboard and advanced visualization tools.

## Motivation

I was searching for an expense tracker, ideally free, to manage transactions from multiple bank accounts and analyze them. However, most apps encourage linking bank accounts for transaction syncing, which I wasn't comfortable with. When attempting to bulk import transactions using CSV files, I noticed that while some files worked, others failed due to parsing errors. Additionally, there was no way to manually intervene and map the fields correctly. This experience led to the idea of Spendex, which includes the following features.

## Core Features

### Effortless Data Import and Mapping

While many expense trackers offer import functionality, the diverse ways transactions are organized in files often lead to parsing errors, data loss, and inaccurate mapping. Spendex overcomes this by providing a flexible column mapping system, enabling users to quickly match their bank's export format to Spendex fields, ensuring a smooth and accurate transition without data loss.

### Transaction Categorization with Keyword Matching

Transactions are automatically categorized by matching their descriptions with predefined keywords. Users can create merchants with keyword matching and pre-assign categories and subcategories to each merchant. When new transactions are imported, their descriptions are evaluated against existing merchant keywords, and if a match is found, the appropriate merchant, category, and subcategory are automatically assigned to the transaction. Once the usual merchants are set up, this process automates categorization for future imports, saving time.

### Customizable Categories & Subcategories

Spendex allows designing a financial organization system with fully customizable categories and subcategories that reflect users unique spending habits and financial goals. Creating and modifying categories is powered by an intuitive, fast user interface with inline editing.

### Bank-Free Transaction Management and Analysis

There’s no need to link sensitive bank accounts. Users can easily import transactions from files or enter them manually, then analyze their spending patterns using Spendex's comprehensive dashboard and visualization tools.

### Comprehensive Presets for Quick Onboarding

Spendex provides a comprehensive set of presets for categories and subcategories, merchants, and mapping rules for common banks. These presets offer a great starting point, making it easy for new users to get up and running quickly and streamlining the onboarding process.

## What is inside?

This project uses many tools like:

-   [Next.js](https://nextjs.org/) with App Router and Server Actions.
-   [ReactJS](https://reactjs.org)
-   [TypeScript](https://www.typescriptlang.org)
-   [Tailwindcss](https://tailwindcss.com)
-   [Prisma](https://www.prisma.io/) as ORM Client.
-   [Clerk](https://clerk.com) for Auth.
-   [TanStack Query](https://tanstack.com/query/latest) for State Management.
-   [React Hook Form](https://react-hook-form.com/)
-   [Zod](https://zod.dev/) for both client side form and server side data validation.
-   [Shadcn](https://ui.shadcn.com)
-   [TanStack Table](https://tanstack.com/table/latest) for tables with pagination, filtering, sorting etc.
-   [Rechart](https://recharts.org/en-US) for data visualization and analysis.
-   [PapaParse](https://www.papaparse.com/) for CSV parsing.
-   [SheetJS](https://www.npmjs.com/package/xlsx) for Excel parsing.
-   [Motion](https://motion.dev/) for animation.
-   [Eslint](https://eslint.org)
-   [Prettier](https://prettier.io)
