"use server"

import { prisma } from "@workspace/db"
import { revalidatePath } from "next/cache"

export async function logTrade(formData: any) {
  try {
    // For now, we'll use a demo user since auth isn't set up yet.
    // In a real app, you'd get the user ID from the session.
    let user = await prisma.user.findFirst()
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "demo@claritrade.com",
          name: "Demo User",
        },
      })
    }

    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        pair: formData.pair,
        direction: formData.direction,
        entry: parseFloat(formData.entry),
        exit: formData.exit ? parseFloat(formData.exit) : null,
        stopLoss: parseFloat(formData.stopLoss),
        takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : null,
        lotSize: parseFloat(formData.lotSize),
        session: formData.session,
        tags: formData.tags || [],
        psychologyNote: formData.psychologyNote,
        screenshotUrls: formData.screenshotUrls || [],
        dateOpened: new Date(), // Defaulting to now for manual entry
        // rr and result could be calculated here or in a separate step
      },
    })

    revalidatePath("/dashboard")
    return { success: true, trade }
  } catch (error) {
    console.error("Failed to log trade:", error)
    return { success: false, error: "Failed to log trade" }
  }
}
