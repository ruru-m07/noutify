export $(grep -v '^#' ../../.env | xargs) 
bun run db:generate
bun run dev
