"""Message handler for AI-style conversational responses."""

import logging

from telegram import Update
from telegram.ext import Application, ContextTypes, MessageHandler, filters

from src.utils.responses import AI_RESPONSES, FALLBACK_RESPONSE

logger = logging.getLogger(__name__)


def find_response(text: str) -> str:
    """Match user text against known keywords and return the best response."""
    text_lower = text.lower().strip()

    for keyword, response in AI_RESPONSES.items():
        if keyword in text_lower:
            return response

    return FALLBACK_RESPONSE


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.message.text:
        return

    user_text = update.message.text
    user = update.effective_user
    logger.info(
        "Message from %s (id=%s): %s",
        user.first_name if user else "Unknown",
        user.id if user else "?",
        user_text[:100],
    )

    response = find_response(user_text)
    await update.message.reply_text(response)


def register_message_handlers(application: Application) -> None:
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    logger.info("Registered message handler")
