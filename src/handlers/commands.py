"""Command handlers for the Nova Bingo bot."""

import logging

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update, WebAppInfo
from telegram.constants import ParseMode
from telegram.ext import Application, CommandHandler, ContextTypes

from src.config import WEBAPP_URL
from src.utils import responses

logger = logging.getLogger(__name__)


def _play_keyboard() -> InlineKeyboardMarkup | None:
    if not WEBAPP_URL:
        return None
    return InlineKeyboardMarkup(
        [[InlineKeyboardButton("🎮 Open Nova Bingo", web_app=WebAppInfo(url=WEBAPP_URL))]]
    )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    name = user.first_name if user else "Player"
    text = responses.WELCOME.format(name=name)
    if update.message:
        await update.message.reply_text(
            text, parse_mode=ParseMode.MARKDOWN, reply_markup=_play_keyboard()
        )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.HELP, parse_mode=ParseMode.MARKDOWN)


async def howtoplay(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.HOW_TO_PLAY, parse_mode=ParseMode.MARKDOWN)


async def rules(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.RULES, parse_mode=ParseMode.MARKDOWN)


async def play(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(
            responses.PLAY, parse_mode=ParseMode.MARKDOWN, reply_markup=_play_keyboard()
        )


async def deposit(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.DEPOSIT, parse_mode=ParseMode.MARKDOWN)


async def withdraw(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.WITHDRAW, parse_mode=ParseMode.MARKDOWN)


async def balance(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.BALANCE, parse_mode=ParseMode.MARKDOWN)


async def jackpot(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.JACKPOT, parse_mode=ParseMode.MARKDOWN)


async def bonus(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.BONUS, parse_mode=ParseMode.MARKDOWN)


async def active_games(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.ACTIVE_GAMES, parse_mode=ParseMode.MARKDOWN)


async def my_tickets(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.MY_TICKETS, parse_mode=ParseMode.MARKDOWN)


async def support(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.SUPPORT, parse_mode=ParseMode.MARKDOWN)


async def responsible_gaming(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(responses.RESPONSIBLE_GAMING, parse_mode=ParseMode.MARKDOWN)


COMMAND_MAP: dict[str, object] = {
    "start": start,
    "help": help_command,
    "howtoplay": howtoplay,
    "rules": rules,
    "play": play,
    "deposit": deposit,
    "withdraw": withdraw,
    "balance": balance,
    "jackpot": jackpot,
    "bonus": bonus,
    "activegames": active_games,
    "mytickets": my_tickets,
    "support": support,
    "responsiblegaming": responsible_gaming,
}


def register_command_handlers(application: Application) -> None:
    for command, handler_fn in COMMAND_MAP.items():
        application.add_handler(CommandHandler(command, handler_fn))
    logger.info("Registered %d command handlers", len(COMMAND_MAP))
