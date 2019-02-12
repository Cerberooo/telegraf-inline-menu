import test from 'ava'
import Telegraf from 'telegraf'
import {Update} from 'telegram-typings'

import TelegrafInlineMenu from '../source'

import {InlineExtra} from './helpers/telegraf-typing-overrides'

test('simple text without buttons', async t => {
  const menu = new TelegrafInlineMenu('yaay')

  const bot = new Telegraf('')
  bot.use(menu.init({actionCode: 'a'}))

  bot.context.answerCbQuery = () => Promise.resolve(true)
  bot.context.editMessageText = (text, extra: InlineExtra) => {
    t.is(text, 'yaay')
    t.deepEqual(extra.reply_markup.inline_keyboard, [])
    return Promise.resolve(true)
  }

  await bot.handleUpdate({callback_query: {data: 'a'}} as Update)
})

test('main menu', async t => {
  const menu = new TelegrafInlineMenu('yaay')

  const bot = new Telegraf('')
  bot.use(menu.init())

  bot.context.answerCbQuery = () => Promise.resolve(true)
  bot.context.editMessageText = (text, extra: InlineExtra) => {
    t.is(text, 'yaay')
    t.deepEqual(extra.reply_markup.inline_keyboard, [])
    return Promise.resolve(true)
  }

  await bot.handleUpdate({callback_query: {data: 'main'}} as Update)
})

test('markdown text', async t => {
  const menu = new TelegrafInlineMenu('yaay')

  const bot = new Telegraf('')
  bot.use(menu.init({actionCode: 'a'}))

  bot.context.answerCbQuery = () => Promise.resolve(true)
  bot.context.editMessageText = (text, extra: InlineExtra) => {
    t.is(text, 'yaay')
    t.is(extra.parse_mode, 'Markdown')
    return Promise.resolve(true)
  }

  await bot.handleUpdate({callback_query: {data: 'a'}} as Update)
})

test('async text func', async t => {
  const menu = new TelegrafInlineMenu(() => Promise.resolve('yaay'))

  const bot = new Telegraf('')
  bot.use(menu.init({actionCode: 'a'}))

  bot.context.answerCbQuery = () => Promise.resolve(true)
  bot.context.editMessageText = text => {
    t.is(text, 'yaay')
    return Promise.resolve(true)
  }

  await bot.handleUpdate({callback_query: {data: 'a'}} as Update)
})

test('menu.init requires action code to be at the base level', t => {
  const menu = new TelegrafInlineMenu('yaay')
  const bot = new Telegraf('')

  t.throws(() => {
    bot.use(menu.init({actionCode: 'a:b'}))
  }, /actioncode/i)
})
