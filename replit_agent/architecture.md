# Architecture Overview

## 1. Introduction

CHONK9K is a cryptocurrency token and web application that spans multiple blockchains. The project primarily focuses on creating, deploying, and managing tokens on Solana with potential expansion to Ethereum-based networks like Base. The architecture follows a modern full-stack JavaScript/TypeScript approach with clear separation between client, server, and blockchain components.

## 2. System Architecture

The system follows a multi-tier architecture:

- **Frontend**: React-based SPA built with Vite and styled with Tailwind CSS
- **Backend**: Node.js Express server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for data modeling and migrations
- **Blockchain**: Multi-chain support with emphasis on Solana and Base (Ethereum L2)

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│   Frontend     │     │    Backend     │     │  Blockchains   │
│  (React/Vite)  │────▶│ (Express/Node) │────▶│(Solana/Base)   │
└────────────────┘     └───────┬────────┘     └────────────────┘
                              │
                              ▼
                       ┌────────────────┐
                       │   Database     │
                       │  (PostgreSQL)  │
                       └────────────────┘
```

## 3. Key Components

### 3.1. Frontend Architecture

The frontend is built with React and uses Vite as the build tool. It incorporates modern UI libraries including:

- **UI Framework**: Tailwind CSS for styling
- **Component Library**: Radix UI components for accessible UI elements
- **Routing**: Implied React Router (based on project structure)
- **State Management**: Not explicitly defined, but likely uses React's built-in state management
- **Theming**: Custom theme system via Shadcn theme JSON

Key design decisions:
- Modular component architecture with Radix UI for accessibility
- CSS utility-first approach with Tailwind
- Client-side rendering with Vite's optimized build system

### 3.2. Backend Architecture

The backend uses Express.js with TypeScript, following a modular structure:

- **API Server**: Express.js with TypeScript
- **Authentication**: Custom JWT-based authentication with MFA support
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Security**: Implements rate limiting, IP-based blocking, and security event logging

Key features:
- Session-based authentication with PostgreSQL session storage
- Multi-factor authentication (MFA) with recovery codes
- Security-focused middleware for rate limiting and attack prevention
- RESTful API endpoints for token, user, and application data

### 3.3. Database Schema

The database uses PostgreSQL with Drizzle ORM. Key entities include:

- **Users**: Account information, authentication, and preferences
- **Token Stats**: Token performance metrics and historical data
- **Badge System**: Achievement tracking for gamified interactions
- **Trivia/Quiz**: Knowledge test system with rewards
- **Staking**: Token staking pools and user stakes
- **Mining**: Virtual mining system simulation
- **Referrals**: User referral tracking and rewards
- **Learning**: Educational modules and progress tracking

Data modeling follows a relational approach with carefully defined relationships between entities.

### 3.4. Blockchain Integration

The project supports multiple blockchains:

- **Solana**: Primary blockchain for the CHONK9K token
- **Base**: Ethereum L2 for additional token deployment
- **Cross-chain**: Infrastructure to support tokens across multiple chains

Token contracts:
- **Solana**: SPL Token standard
- **Base/Ethereum**: ERC-20 standard through OpenZeppelin contracts

## 4. Data Flow

### 4.1. Authentication Flow

1. User registers or logs in through the frontend
2. Backend validates credentials and issues session token
3. Optional MFA verification for enhanced security
4. User receives JWT token for authenticated API access
5. Session extension based on "remember me" functionality

### 4.2. Token Interaction Flow

1. User connects wallet (Solana or Ethereum-based)
2. Backend validates wallet signature
3. Token operations (transfer, stake, etc.) trigger blockchain transactions
4. Transactions are submitted to respective blockchain networks
5. Backend records transaction details in database
6. Frontend displays updated token balances and transaction status

### 4.3. Feature Interaction Flows

- **Staking**: Users lock tokens for rewards, tracked both on-chain and in database
- **Mining Simulation**: Virtual mining operations generate yield without actual blockchain mining
- **Spin Wheel**: Chance-based token distribution through gamified interface
- **Referrals**: Users gain rewards by inviting others, tracked through database relationships

## 5. External Dependencies

### 5.1. Blockchain Services

- **Solana RPC**: Connection to Solana network via QuickNode
- **Base/Ethereum RPC**: Access to Base network endpoints
- **Wallet Integration**: Support for multiple wallets including Phantom, Coinbase, MetaMask, etc.

### 5.2. Development and Monitoring

- **Sentry**: Error tracking and performance monitoring
- **Hardhat**: Ethereum development environment
- **Anchor**: Solana development framework

### 5.3. Third-Party APIs

- **CoinMarketCap**: Token market data integration
- **PayPal**: Potential payment integration

## 6. Deployment Strategy

The system appears to be designed for deployment across multiple environments:

- **Development**: Local development with hot module replacement
- **Testing**: Automated testing with Jest
- **Production**: Node.js production server with built assets

### 6.1. Infrastructure

- **Containerization**: Docker support through Dockerfile
- **Platform**: Replit hosting with specific configuration
- **Environment Variables**: Separated .env files for different environments
- **Database**: PostgreSQL through Neon serverless platform

### 6.2. CI/CD

The repository includes scripts for automated deployment and verification:
- Token contract deployment scripts for both Solana and Base
- Contract verification scripts for post-deployment verification
- Release management scripts for Sentry integration

### 6.3. Security Considerations

- **Environment Isolation**: Separation of development and production environments
- **Secret Management**: Environment variables for sensitive configuration
- **Error Handling**: Structured error handling and logging through Sentry
- **Security Monitoring**: Event logging for security-related events

## 7. Future Considerations

The architecture shows preparation for potential future enhancements:

1. **Multi-chain Expansion**: Infrastructure to support additional blockchains
2. **NFT Integration**: Potential for NFT collection development
3. **Marketplace Features**: Framework for token/NFT trading functionality
4. **Enhanced Security**: Advanced authentication and authorization mechanisms
5. **Educational Content**: Learning modules and progression tracking

## 8. Conclusion

The CHONK9K project architecture represents a modern, scalable approach to building a multi-chain token ecosystem. By leveraging TypeScript, React, Express, and blockchain technologies, it creates a foundation for a feature-rich token platform with gamification elements.

The modular design facilitates future expansion while maintaining separation of concerns between frontend, backend, database, and blockchain interactions. Security considerations are integrated throughout the architecture, reflecting best practices for web3 application development.