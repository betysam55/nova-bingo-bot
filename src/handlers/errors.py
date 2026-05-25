"""Error handler for the Nova Bingo bot."""

import logging
import traceback

from telegram import Update
from telegram.ext import ContextTypes

logger = logging.getLogger(__name__)


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    logger.error("Exception while handling an update:", exc_info=context.error)

    tb_list = traceback.format_exception(None, context.error, context.error.__traceback__)
    tb_string = "".join(tb_list)
    logger.debug("Traceback:\n%s", tb_string)

    if isinstance(update, Update) and update.message:
        await update.message.reply_text(
            "⚠️ Oops! Something went wrong. Please try again in a moment.\n"
            "If the issue persists, use /support for help."
        )
