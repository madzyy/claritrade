"use server"

import { getOrCreatePrismaUser } from "@/lib/auth"
import { prisma } from "@workspace/db"
import { revalidatePath } from "next/cache"

export async function logTrade(formData: any) {
  try {
    const user = await getOrCreatePrismaUser()

    if (!user) {
      return { success: false, error: "You must be signed in to log a trade." }
    }

    const entry = parseFloat(formData.entry)
    const stopLoss = parseFloat(formData.stopLoss)
    const takeProfit = formData.takeProfit ? parseFloat(formData.takeProfit) : null
    const exit = formData.exit ? parseFloat(formData.exit) : null
    const lotSize = parseFloat(formData.lotSize)
    const direction = formData.direction.toLowerCase()
    const pair = formData.pair.toUpperCase()

    // 1. Calculate RR Ratio (Potential)
    let rr = null
    if (takeProfit) {
      const risk = Math.abs(entry - stopLoss)
      const reward = Math.abs(takeProfit - entry)
      if (risk > 0) {
        rr = reward / risk
      }
    }

    // 2. Calculate Outcome and Result ($) if Exit is provided
    let outcome = "PENDING"
    let resultAmount = null

    if (exit) {
      const points = direction === "buy" ? (exit - entry) : (entry - exit)
      outcome = points > 0 ? "WIN" : points < 0 ? "LOSS" : "BREAK EVEN"
      
      // Fixed Multiplier Logic:
      let multiplier = 100 // Default (Gold)
      
      if (pair.includes("JPY")) {
        multiplier = 1000 // JPY pairs (3 decimals): 0.01 = 1 pip
      } else if (pair.includes("XAU") || pair.includes("GOLD")) {
        multiplier = 100 // Gold: 1.00 move = $100 per lot
      } else if (pair.includes("BTC") || pair.includes("ETH")) {
        multiplier = 1 // Crypto: 1.00 move = $1 per lot
      } else if (pair.includes("NAS") || pair.includes("US30") || pair.includes("SPX") || pair.includes("GER")) {
        multiplier = 1 // Indices: 1.00 point = $1 per lot
      } else {
        // Standard Forex (5 decimals): EURUSD, GBPUSD, etc.
        // 0.00010 = 1 pip. 1 lot = $10 per pip. 
        // 0.00010 * 1 lot * 100,000 = $10.
        multiplier = 100000 
      }
      
      resultAmount = points * lotSize * multiplier
    }

    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        pair: pair,
        direction: direction.toUpperCase(),
        entry: entry,
        exit: exit,
        stopLoss: stopLoss,
        takeProfit: takeProfit,
        lotSize: lotSize,
        rr: rr,
        result: resultAmount,
        outcome: outcome,
        session: formData.session,
        tags: formData.tags || [],
        psychologyNote: formData.psychologyNote,
        screenshotUrls: formData.screenshotUrls || [],
        dateOpened: new Date(),
        dateClosed: exit ? new Date() : null,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, trade }
  } catch (error) {
    console.error("Failed to log trade:", error)
    return { success: false, error: "Failed to log trade" }
  }
}
