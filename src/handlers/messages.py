"""Message handler for AI-style conversational responses."""

import logging
import time
from collections import defaultdict

from telegram import Update
from telegram.ext import Application, ContextTypes, MessageHandler, filters

from src.utils.responses import AI_RESPONSES, FALLBACK_RESPONSE

logger = logging.getLogger(__name__)

_RATE_WINDOW = 10  # seconds
_RATE_LIMIT = 5  # max messages per window
_user_timestamps: dict[int, list[float]] = defaultdict(list)

_MAX_INPUT_LEN = 500


def _is_rate_limited(user_id: int) -> bool:
    """Return True if the user has exceeded the message rate limit."""
    now = time.monotonic()
    timestamps = _user_timestamps[user_id]
    _user_timestamps[user_id] = [t for t in timestamps if now - t < _RATE_WINDOW]
    if len(_user_timestamps[user_id]) >= _RATE_LIMIT:
        return True
    _user_timestamps[user_id].append(now)
    return False


def find_response(text: str) -> str:
    """Match user text against known keywords and return the best response."""
    text_lower = text[:_MAX_INPUT_LEN].lower().strip()

    for keyword, response in AI_RESPONSES.items():
        if keyword in text_lower:
            return response

    return FALLBACK_RESPONSE


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.message.text:
        return

    user = update.effective_user
    user_id = user.id if user else 0

    if _is_rate_limited(user_id):
        await update.message.reply_text("⏳ You're sending messages too fast. Please slow down.")
        return

    user_text = update.message.text
    logger.info("Message from user_id=%s (len=%d)", user_id, len(user_text))

    response = find_response(user_text)
    await update.message.reply_text(response)


def register_message_handlers(application: Application) -> None:
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    logger.info("Registered message handler")
