# Decentralized Transactions App

This is a decentralized application (DApp) that allows users to send and view transactions on the Ethereum blockchain. The project includes a frontend built with React and a Solidity smart contract for handling transactions.

## Features

- Connect to MetaMask wallet
- Send Ethereum transactions with a message and keyword
- View the latest transactions
- Responsive design for both desktop and mobile

## Project Structure

### Frontend

- **NavBar**: Navigation bar with menu items and a toggle menu for mobile view.
- **Welcome**: Main page component for connecting the wallet and sending transactions.
- **Transactions**: Component to display the latest transactions.
- **Loader**: Component to show a loading animation during transactions.
- **Footer**: Footer component with navigation links and copyright information.
- **ServiceCard and Services**: Components to display various services offered.
- **TransactionContext**: Context for managing global state and Ethereum interactions.

### Smart Contract

- **Transactions.sol**: Solidity contract for recording and retrieving transactions.
