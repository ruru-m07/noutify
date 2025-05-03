export $(grep -v '^#' ../../.env | xargs) 
bun run dev
