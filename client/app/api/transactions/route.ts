import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Go up from `client/` to `src/`, then into `contract/data`
    const filePath = path.resolve(process.cwd(), "../contract/data/all-transactions.json")
    console.log("Resolved file path:", filePath)

    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist at path: " + filePath)
    }

    const fileContents = fs.readFileSync(filePath, "utf-8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Failed to load transaction data:", err)
    return new NextResponse(JSON.stringify({ error: "Failed to load transaction data" }), {
      status: 500,
    })
  }
}
