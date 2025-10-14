# Miden.name

A decentralized identity system built on the Miden ecosystem, allowing users to register and manage `.miden` domain names.

## Overview

Miden.name provides a user-friendly interface for claiming and managing decentralized identities on the Miden network. Users can search for available `.miden` domain names, register them through wallet connection, and manage their on-chain identity.

The application leverages the Miden Wallet Adapter for seamless wallet integration and the Miden SDK for blockchain interactions, providing a complete frontend solution for decentralized identity management.

## Current Status

### ✅ Completed Features
- Domain search with real-time availability checking
- Wallet connection and integration with Miden Wallet
- Domain registration flow with pricing calculations
- Mock purchase functionality
- Balance tracking with auto-refresh
- Responsive design for mobile and desktop
- Testnet warning modal

### 🚧 In Progress
- **Smart Contract Integration**: Awaiting smart contract deployment to enable actual domain registration on-chain
- **Identity Page**: Under construction - will provide comprehensive identity management features

### 📋 Planned Features
- Real domain registration via smart contracts
- Domain transfer functionality
- Identity profile management

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite 7
- **Routing**: React Router 7 (file-based routing)
- **Styling**: TailwindCSS with custom CSS variables
- **UI Components**: Radix UI primitives (Shadcn-style)
- **Blockchain**: Miden SDK (`@demox-labs/miden-sdk`)
- **Wallet**: Miden Wallet Adapter

### Project Structure

```
src/
├── components/          # Shared components
│   ├── ui/             # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── site-header.tsx # Main navigation header
│   └── ...
├── contexts/           # React contexts
│   └── MidenClientContext.tsx  # Miden SDK client provider
├── hooks/              # Custom React hooks
│   ├── useBalance.tsx  # Balance tracking with auto-refresh
│   └── useStorage.tsx  # Account storage access
├── lib/                # Utilities and helpers
│   ├── midenClient.ts  # Miden SDK utilities
│   └── utils.ts        # General utilities
├── pages/              # Route pages
│   ├── home/           # Domain search page
│   └── register/       # Domain registration page
└── main.tsx            # App entry point with providers
```

### Key Features

**Provider Hierarchy**:
```
WalletProvider (Wallet connection)
  └─ WalletModalProvider (Wallet UI)
      └─ MidenClientProvider (Miden SDK)
          └─ ThemeProvider (Theming)
              └─ App Routes
```

**Mock Domain Pricing**:
- Base price: 5 MIDEN/year
- Length multipliers:
  - 1 character: 5x (25 MIDEN/year)
  - 2 characters: 4x (20 MIDEN/year)
  - 3 characters: 3x (15 MIDEN/year)
  - 4 characters: 2x (10 MIDEN/year)
  - 5+ characters: 1x (5 MIDEN/year)

**Domain Validation**:
- Alphanumeric characters only
- Maximum 21 characters
- Real-time validation with debouncing (500ms)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Miden Wallet browser extension installed

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd midenid-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment

The application currently connects to:
- **Testnet RPC**: `https://rpc.testnet.miden.io`
- **Transaction Prover**: `https://tx-prover.testnet.miden.io`

> ⚠️ **Note**: This is a testnet deployment. All transactions and data are for testing purposes only.
