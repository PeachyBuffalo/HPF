FROM node:14-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including TypeScript
RUN npm install
RUN npm install typescript @types/node @types/react @types/react-dom @types/jest @babel/plugin-proposal-private-property-in-object

# Copy source code
COPY . .

# Ensure TypeScript files are used instead of JS
RUN find src -name "*.js" -delete || true
RUN find src -name "*.jsx" -delete || true

# Update import statements to use .tsx extensions
RUN find src -type f -name "*.tsx" -exec sed -i 's/from '\''\.\/\([^'"'"']*\)['\''];/from '\''.\/\1.tsx'\'';/g' {} +
RUN find src -type f -name "*.tsx" -exec sed -i 's/from '\''\.\.\/\([^'"'"']*\)['\''];/from '\''.\.\/\1.tsx'\'';/g' {} +

# Build TypeScript
RUN npm run build

# Start the app
CMD ["npm", "start"] 