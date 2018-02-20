require('fluent-intl-polyfill');
const { MessageContext } = require('fluent');
const { negotiateLanguages } = require('fluent-langneg');
import API from './api';

const SUPPORTED_LOCALES = ['en', 'cs'];

export async function createMessagesGenerator(api: API, userLocales: string[]) {
  const currentLocales = negotiateLanguages(userLocales, SUPPORTED_LOCALES, {
    defaultLocale: 'cs',
  });

  const localeMessages: any = await Promise.all(
    currentLocales.map(async (locale: string) => [
      locale,
      await api.fetchLocale(locale),
    ])
  );
  return function*(): any {
    for (const [locale, messages] of localeMessages) {
      const cx = new MessageContext(locale);
      cx.addMessages(messages);
      yield cx;
    }
  };
}
