export interface ScamType {
  name: string;
  description: string;
  statistics: string;
  moneyLost: string;
  resource: {
    name: string;
    url: string;
  };
  followUpMessage: string;
  linkText: string;
  defeatMessage: string;
}

export const scamTypes: Record<string, ScamType> = {
  lottery: {
    name: "Lottery/Prize Scam",
    description: "This is a classic lottery or prize scam where scammers claim you've won a large sum of money or a valuable prize. The catch? You need to provide personal information or pay fees upfront to claim your 'winnings'. Legitimate lotteries never ask for payment to receive prizes, and you can't win a lottery you never entered!",
    statistics: "In 2023, over 63,000 people in the UK reported lottery and prize scams, with victims losing an average of £1,100 each.",
    moneyLost: "Total losses exceeded £69 million in the UK alone in 2023.",
    resource: {
      name: "Financial Conduct Authority (FCA) - Scam Smart",
      url: "https://www.fca.org.uk/scamsmart"
    },
    followUpMessage: "Excellent! Now, to claim your prize, you'll need to pay a small processing fee of £500. Please register on our secure payment portal QuickTransferNow to complete the transaction. Your million dollars awaits!",
    linkText: "Register on QuickTransferNow",
    defeatMessage: "Bah! You're too clever for this one... 🎫 The novelty check goes back in the drawer. Real prizes never require upfront fees."
  },
  inheritance: {
    name: "Inheritance/Nigerian Prince Scam",
    description: "This scam involves someone claiming to be royalty, a wealthy individual, or a lawyer representing a deceased person. They promise you a share of a large inheritance or fortune in exchange for helping them transfer money. They'll ask for your bank details and may request upfront fees for 'legal costs' or 'transfer fees'.",
    statistics: "Despite being one of the oldest internet scams, advance-fee fraud (including inheritance scams) still affects thousands annually. In 2023, over 12,000 cases were reported in the UK.",
    moneyLost: "Victims of advance-fee fraud lost over £24 million in 2023.",
    resource: {
      name: "Action Fraud - UK's National Fraud Reporting Centre",
      url: "https://www.actionfraud.police.uk"
    },
    followUpMessage: "Wonderful! You are most kind to help. To cover the legal fees and international transfer costs, I need you to send £2,000 through GlobalMoneyExpress. Once received, you will get your 30% share of $25 million! Please click here to register and send the funds.",
    linkText: "Send Money via GlobalMoneyExpress",
    defeatMessage: "Curses! You see right through me... 👑 The crown's from a costume shop. Actual lawyers use official channels, not Gmail."
  },
  techSupport: {
    name: "Tech Support Scam",
    description: "Scammers pretend to be from legitimate tech companies (like Microsoft, Apple, or your internet provider) claiming your computer has a virus or security issue. They pressure you to give them remote access to your device or pay for unnecessary 'fixes'. Real tech companies will never cold-call you about computer problems!",
    statistics: "Tech support scams saw a 50% increase in 2023, with over 18,000 reports in the UK. Elderly people are particularly targeted.",
    moneyLost: "Victims lost approximately £27 million to tech support scams in 2023.",
    resource: {
      name: "National Cyber Security Centre (NCSC)",
      url: "https://www.ncsc.gov.uk/collection/scams"
    },
    followUpMessage: "Good decision! I will fix your computer immediately. The emergency virus removal service costs £299. Please pay through SecurePayNow so I can remotely access your system and remove the 47 viruses detected. Your computer is at serious risk!",
    linkText: "Pay £299 on SecurePayNow",
    defeatMessage: "Well well... You're sharper than most. 💻 My certification was a screenshot. Tech companies don't cold-call about viruses."
  },
  tax: {
    name: "Tax/Government Impersonation Scam",
    description: "Scammers impersonate tax authorities (HMRC, IRS) or other government agencies, claiming you owe back taxes or have outstanding fines. They create urgency by threatening arrest, legal action, or deportation. Government agencies will never demand immediate payment over the phone or threaten arrest.",
    statistics: "HMRC-related scams are the most commonly reported phone scams in the UK, with over 150,000 reports in 2023.",
    moneyLost: "Tax scams resulted in losses of over £16 million in 2023.",
    resource: {
      name: "HMRC - Recognise Scams",
      url: "https://www.gov.uk/topic/dealing-with-hmrc/tax-scams"
    },
    followUpMessage: "Smart choice! To avoid arrest, you must pay the £5,000 immediately. Use PayGovFast to make an urgent payment. The warrant for your arrest has been issued and officers are on their way. Pay now to cancel the warrant!",
    linkText: "Make Urgent Payment on PayGovFast",
    defeatMessage: "Blast! You see through my ruse! 🏛️ The badge was cardboard. Tax authorities send proper letters, not phone threats."
  },
  romance: {
    name: "Romance/Dating Scam",
    description: "Scammers create fake profiles on dating sites or social media to build romantic relationships with victims. After gaining trust over weeks or months, they fabricate emergencies requiring money (medical bills, travel costs, business problems). They may also ask for gift cards or cryptocurrency.",
    statistics: "Romance scams are among the most financially damaging, with over 8,000 reports in 2023. The average loss per victim is £9,000.",
    moneyLost: "Romance fraud cost UK victims over £92 million in 2023.",
    resource: {
      name: "Get Safe Online - Romance Fraud",
      url: "https://www.getsafeonline.org/personal/articles/romance-scams/"
    },
    followUpMessage: "Oh thank you so much! I knew you were special. I just need you to verify your identity with a small payment first - it's just £50 through LoveConnectPay. After that, we can finally meet in person! I can't wait to see you! ❤️",
    linkText: "Verify Identity on LoveConnectPay",
    defeatMessage: "Ah, cruel fortune! You've seen through my act... 💔 The stock photos weren't even expensive. Anyone requesting money in a new relationship is suspect."
  },
  delivery: {
    name: "Parcel/Delivery Scam",
    description: "You receive a text or email claiming a package is being held at customs or couldn't be delivered, requiring you to pay a fee to release it. The message includes a link to a fake website designed to steal your payment details. Legitimate delivery companies don't ask for customs fees via text.",
    statistics: "Delivery scams surged with online shopping, with over 45,000 reports in 2023, particularly around holidays.",
    moneyLost: "Estimated losses of £12 million to delivery scams in 2023.",
    resource: {
      name: "Which? - Parcel Delivery Scams",
      url: "https://www.which.co.uk/consumer-rights/advice/how-to-spot-a-parcel-delivery-text-scam"
    },
    followUpMessage: "Perfect! To release your package from customs, please pay the £500 holding fee through ParcelPayPortal. Your package contains valuable items and will be destroyed if not claimed within 24 hours. Act fast!",
    linkText: "Pay Customs Fee on ParcelPayPortal",
    defeatMessage: "Clever, very clever... 📦 There's no package. Real couriers use official sites, not text links."
  },
  stranded: {
    name: "Stranded/Emergency Scam",
    description: "Scammers hack email or social media accounts (or create fake ones) to impersonate friends or family members. They claim to be stranded in a foreign country, robbed, or facing an emergency, and need money wired immediately. They often use emotional pressure and urgency to prevent you from verifying the story.",
    statistics: "Over 5,000 cases of 'friend in need' scams were reported in 2023, often targeting elderly people.",
    moneyLost: "Losses totaled approximately £8 million in 2023.",
    resource: {
      name: "Age UK - Scams",
      url: "https://www.ageuk.org.uk/information-advice/money-legal/scams-fraud/"
    },
    followUpMessage: "Oh thank god! I'm at the police station now and they said I can leave once I pay the fine. I need you to wire £3,000 urgently through EmergencyWire. I've lost my phone and can't access my bank. Please hurry, they're keeping me here!",
    linkText: "Wire Money via EmergencyWire",
    defeatMessage: "Foiled again! You're too smart for this trick... 🌍 The background noise was YouTube. Always call people back on a number you know."
  },
  investment: {
    name: "Investment/Get-Rich-Quick Scam",
    description: "Scammers promise incredible returns on investments in cryptocurrency, stocks, forex, or other opportunities. They use high-pressure tactics, fake testimonials, and promises of 'insider information'. These are often Ponzi schemes where early investors are paid with money from new victims. If it sounds too good to be true, it probably is!",
    statistics: "Investment fraud saw record losses in 2023, with over 15,000 reports. Cryptocurrency scams make up a growing portion.",
    moneyLost: "Investment scams cost victims over £240 million in 2023, the highest category of scam losses.",
    resource: {
      name: "FCA Warning List - Check Before You Invest",
      url: "https://www.fca.org.uk/scamsmart/warning-list"
    },
    followUpMessage: "Brilliant! This opportunity won't last long. To secure your position in this exclusive crypto investment, you need to deposit a minimum of £5,000 through CryptoInvestPro. Others are already making 400% returns! Register now before all spots are filled!",
    linkText: "Invest Now on CryptoInvestPro",
    defeatMessage: "Confound it! You've seen right through my scheme... 💰 The graphs were Excel screenshots. Real investments require FCA registration."
  },
  rickRoll: {
    name: "Rick Roll (Easter Egg)",
    description: "You encountered the legendary Rick Roll - a classic internet prank where unsuspecting users are tricked into clicking a link to Rick Astley's 'Never Gonna Give You Up' music video. While not a real scam, it's a reminder to always be cautious about clicking suspicious links! In the current iteration Rick is substituted by crazy Japanese Daikons, because... why not. If you've read through this text, click here.",
    statistics: "The Rick Roll has pranked millions since 2007 and shows no signs of stopping. It's become one of the internet's most enduring memes.",
    moneyLost: "No money lost - just dignity! Though you may have wasted a few minutes of your life.",
    resource: {
      name: "Know Your Meme - Rickrolling",
      url: "https://knowyourmeme.com/memes/rickroll"
    },
    followUpMessage: "That's what I call a DAIKON ROLL!",
    linkText: "MOAR DAIKONS",
    defeatMessage: "You honestly should have clicked that link. Daikons 4eva!"
  }
};

export function getScamTypeFromResponse(response: string): ScamType {
  const lowerResponse = response.toLowerCase();
  
  // Check for rick roll first (special case)
  if (lowerResponse.includes('rick roll') || lowerResponse.includes('rickroll')) {
    return scamTypes.rickRoll;
  } else if (lowerResponse.includes('won') || lowerResponse.includes('prize') || lowerResponse.includes('million')) {
    return scamTypes.lottery;
  } else if (lowerResponse.includes('prince') || lowerResponse.includes('inherit') || lowerResponse.includes('funds')) {
    return scamTypes.inheritance;
  } else if (lowerResponse.includes('virus') || lowerResponse.includes('computer') || lowerResponse.includes('click')) {
    return scamTypes.techSupport;
  } else if (lowerResponse.includes('irs') || lowerResponse.includes('tax') || lowerResponse.includes('arrest')) {
    return scamTypes.tax;
  } else if (lowerResponse.includes('singles') || lowerResponse.includes('meet') || lowerResponse.includes('credit card')) {
    return scamTypes.romance;
  } else if (lowerResponse.includes('package') || lowerResponse.includes('customs') || lowerResponse.includes('delivery')) {
    return scamTypes.delivery;
  } else if (lowerResponse.includes('stranded') || lowerResponse.includes('wallet') || lowerResponse.includes('wire')) {
    return scamTypes.stranded;
  } else if (lowerResponse.includes('investment') || lowerResponse.includes('rich') || lowerResponse.includes('opportunity')) {
    return scamTypes.investment;
  }
  
  // Default to lottery if no match
  return scamTypes.lottery;
}
