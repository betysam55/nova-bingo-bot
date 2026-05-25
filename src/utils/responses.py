"""Response templates for the Nova Bingo AI Assistant."""

WELCOME = (
    "🎰 *Welcome to Nova Bingo!* 🎰\n\n"
    "Hey {name}! Ready to play some Bingo?\n\n"
    "🎯 Pick a room, choose your board, and compete live against other players!\n\n"
    "Use /help to see all commands.\n"
    "Use /howtoplay to learn the rules.\n\n"
    "🍀 Good luck and play responsibly!"
)

HELP = (
    "📋 *Nova Bingo Commands*\n\n"
    "🎮 *Game*\n"
    "/play — Join a game room\n"
    "/howtoplay — Learn how to play\n"
    "/rules — Full game rules\n"
    "/activegames — See active games\n"
    "/mytickets — View your tickets\n\n"
    "💰 *Wallet*\n"
    "/deposit — Add funds\n"
    "/withdraw — Cash out winnings\n"
    "/balance — Check your balance\n\n"
    "🏆 *Rewards*\n"
    "/jackpot — Jackpot info\n"
    "/bonus — Bonus patterns & rewards\n\n"
    "ℹ️ *Other*\n"
    "/support — Get help\n"
    "/responsiblegaming — Play safe tips\n\n"
    "Just type a question anytime — I'm here to help! 💬"
)

HOW_TO_PLAY = (
    "🎯 *How to Play Nova Bingo*\n\n"
    "1️⃣ *Choose a Room* — Pick a room based on your preferred bet amount.\n"
    "2️⃣ *Select a Board* — Each board is unique. Once selected, it's locked in.\n"
    "3️⃣ *Wait for Players* — The game starts automatically when enough players join.\n"
    "4️⃣ *Numbers Called Live* — Numbers are called automatically in real-time.\n"
    "5️⃣ *Mark Your Numbers* — Match called numbers on your board.\n"
    "6️⃣ *Call BINGO!* — Complete a winning pattern first to win! 🎉\n\n"
    "✅ All wins are verified automatically.\n"
    "🔄 Disconnected? Don't worry — reconnect and resume!\n\n"
    "🍀 Good luck!"
)

RULES = (
    "📜 *Nova Bingo Rules*\n\n"
    "• Each player gets a unique board per game.\n"
    "• Boards are locked once selected — no changes allowed.\n"
    "• Numbers are called automatically by the system.\n"
    "• A Bingo is valid only if ALL marked numbers were actually called.\n"
    "• The first player to complete a winning pattern wins.\n"
    "• Games end immediately after a verified winner.\n"
    "• Bonus patterns may award additional rewards.\n"
    "• Jackpots are special prize pools that grow over time.\n\n"
    "⚠️ *Fair Play*\n"
    "• No cheating or exploiting bugs.\n"
    "• Play responsibly — never bet more than you can afford.\n"
    "• All games are monitored for fairness."
)

PLAY = (
    "🎮 *Ready to Play!*\n\n"
    "Open the Nova Bingo Mini App in Telegram to:\n"
    "• Browse available rooms\n"
    "• Pick your bet amount\n"
    "• Select your Bingo board\n"
    "• Join the live game!\n\n"
    "👥 Check the player count and prize pool before joining.\n"
    "🍀 Good luck!"
)

DEPOSIT = (
    "💳 *Deposit Funds*\n\n"
    "To add funds to your Nova Bingo wallet:\n"
    "1. Open the Mini App\n"
    "2. Go to *Wallet* → *Deposit*\n"
    "3. Choose your preferred payment method\n"
    "4. Enter the amount and confirm\n\n"
    "Deposits are processed quickly so you can jump into a game! 🎮"
)

WITHDRAW = (
    "💸 *Withdraw Winnings*\n\n"
    "To cash out your winnings:\n"
    "1. Open the Mini App\n"
    "2. Go to *Wallet* → *Withdraw*\n"
    "3. Choose your withdrawal method\n"
    "4. Enter the amount and confirm\n\n"
    "Processing times may vary by method. 🏦"
)

BALANCE = (
    "💰 *Check Balance*\n\n"
    "View your current balance in the Nova Bingo Mini App under *Wallet*.\n\n"
    "Your balance updates in real-time after every game, deposit, or withdrawal."
)

JACKPOT = (
    "🏆 *Jackpot*\n\n"
    "The Jackpot is a special prize pool that grows with every game!\n\n"
    "💰 Complete the required winning condition to claim the jackpot reward.\n"
    "📈 The longer it goes unclaimed, the bigger it gets!\n\n"
    "Check the current jackpot amount in the Mini App. Good luck! 🍀"
)

BONUS = (
    "🎁 *Bonus Patterns & Rewards*\n\n"
    "Beyond the standard Bingo, you can earn bonus rewards:\n\n"
    "• *Multiple Patterns* — Complete more than one pattern for extra rewards.\n"
    "• *Full Board* — Fill your entire board for a special bonus.\n"
    "• *Speed Bonus* — Win within the first few calls for a bonus multiplier.\n\n"
    "Bonus details are shown in each game room. 🎯"
)

ACTIVE_GAMES = (
    "🎮 *Active Games*\n\n"
    "Open the Nova Bingo Mini App to see all live and upcoming games:\n"
    "• 👥 Player counts\n"
    "• 💰 Prize pools\n"
    "• ⏱️ Countdown timers\n"
    "• 🎯 Available rooms\n\n"
    "Pick a room and jump in! 🚀"
)

MY_TICKETS = (
    "🎫 *My Tickets*\n\n"
    "View your active and past game tickets in the Mini App.\n\n"
    "• Active tickets show your current boards and game status.\n"
    "• Past tickets show your game history and results.\n\n"
    "Open the Mini App to check your tickets! 📱"
)

SUPPORT = (
    "🆘 *Need Help?*\n\n"
    "I'm here to assist! You can:\n\n"
    "• Ask me any question right here 💬\n"
    "• Use /howtoplay for game instructions\n"
    "• Use /rules for full game rules\n"
    "• Use /help to see all commands\n\n"
    "For account issues or technical problems, describe your issue and I'll do my best to help!"
)

RESPONSIBLE_GAMING = (
    "🛡️ *Responsible Gaming*\n\n"
    "At Nova Bingo, we care about your well-being.\n\n"
    "✅ *Tips for Safe Play:*\n"
    "• Set a budget before you play and stick to it.\n"
    "• Never bet more than you can afford to lose.\n"
    "• Take regular breaks.\n"
    "• Don't chase losses.\n"
    "• Gaming should be fun — if it stops being fun, take a step back.\n\n"
    "🕐 Remember: It's just a game. Play smart, play safe! 💚"
)

UNKNOWN_COMMAND = "🤔 I didn't recognize that command.\nUse /help to see all available commands!"

# Keywords and their responses for the AI message handler
AI_RESPONSES: dict[str, str] = {
    "how do i play": (
        "🎯 Choose your bet amount, pick a Bingo board, and wait for the game "
        "to start automatically. Numbers will be called live. Complete a winning "
        "pattern before others and call BINGO! 🎉"
    ),
    "how to play": (
        "🎯 Choose your bet amount, pick a Bingo board, and wait for the game "
        "to start automatically. Numbers will be called live. Complete a winning "
        "pattern before others and call BINGO! 🎉"
    ),
    "disconnect": (
        "🔄 No worries! Your game can automatically reconnect and restore "
        "your board and called numbers."
    ),
    "reconnect": (
        "🔄 No worries! If you get disconnected, the system will automatically "
        "restore your game — your board and called numbers are saved."
    ),
    "jackpot": (
        "💰 Jackpot is a special prize pool that grows over time. Complete "
        "the required winning condition to claim the jackpot reward!"
    ),
    "winner verified": (
        "✅ Your marked numbers are checked against the called numbers and "
        "winning patterns before Bingo is confirmed."
    ),
    "how is the winner": (
        "✅ Your marked numbers are checked against the called numbers and "
        "winning patterns before Bingo is confirmed."
    ),
    "verification": (
        "✅ Every Bingo claim is verified automatically. Your marked numbers "
        "are checked against the called numbers and winning patterns."
    ),
    "how many players": (
        "👥 You can see the live player count and estimated prize pool "
        "directly inside the game room."
    ),
    "player count": (
        "👥 The live player count and estimated prize pool are shown directly in the game room!"
    ),
    "deposit": (
        "💳 To deposit, open the Mini App → Wallet → Deposit. "
        "Choose your payment method and amount!"
    ),
    "withdraw": (
        "💸 To withdraw, open the Mini App → Wallet → Withdraw. "
        "Select your method and enter the amount!"
    ),
    "balance": ("💰 Check your balance in the Mini App under Wallet. It updates in real-time!"),
    "bonus": (
        "🎁 Bonus rewards include multiple pattern wins, full board bonuses, "
        "and speed bonuses. Check each room for details!"
    ),
    "rules": (
        "📜 Each player gets a unique board. Numbers are called automatically. "
        "First to complete a valid pattern wins! Use /rules for full details."
    ),
    "board": (
        "🎯 Each board is unique and locked once you select it. "
        "Choose wisely — your board is yours for the entire game!"
    ),
    "countdown": (
        "⏱️ After enough players join, a countdown starts. "
        "Once it hits zero, the game begins and numbers are called live!"
    ),
    "auto caller": (
        "🔢 Numbers are called automatically by the system in real-time. "
        "Just watch and mark your board!"
    ),
    "pattern": (
        "🎯 Winning patterns include lines, diagonals, corners, and more. "
        "Check the game room for the specific patterns in each round!"
    ),
    "wallet": (
        "💰 Your wallet lets you deposit, withdraw, and track your balance. "
        "Access it from the Mini App!"
    ),
    "login": (
        "🔐 Log in securely through Telegram. Your account is linked "
        "to your Telegram profile — no extra passwords needed!"
    ),
    "security": (
        "🔒 Your account is secured through Telegram's authentication. "
        "We never store passwords. Play with confidence!"
    ),
    "prize": (
        "🏆 The prize pool is shown in each game room and updates live "
        "as more players join. The more players, the bigger the prize!"
    ),
    "cheat": (
        "🚫 Cheating is not possible. All games are monitored, numbers are "
        "called by the system, and wins are verified automatically. Fair play only!"
    ),
    "fair": (
        "✅ Nova Bingo ensures fairness with automated number calling, "
        "unique boards, and verified wins. No manipulation possible!"
    ),
    "help": "💬 Use /help to see all available commands, or just ask me anything!",
    "hello": "👋 Hey there! Welcome to Nova Bingo! Ready to play? Use /play to get started! 🎮",
    "hi": "👋 Hey! Welcome to Nova Bingo! Use /help to see what I can do, or /play to jump in! 🎮",
    "thanks": "😊 You're welcome! Good luck in your next game! 🍀",
    "thank you": "😊 Anytime! Wishing you the best of luck! 🍀",
}

FALLBACK_RESPONSE = (
    "🤖 Great question! I'm here to help with anything Nova Bingo related.\n\n"
    "Try asking about:\n"
    "• How to play\n"
    "• Deposits & withdrawals\n"
    "• Jackpots & bonuses\n"
    "• Game rules\n\n"
    "Or use /help to see all commands! 💬"
)
