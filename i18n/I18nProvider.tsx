'use client';

import { NextIntlClientProvider, IntlErrorCode } from 'next-intl';
import { useState, useEffect, ReactNode } from 'react';

import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';

const messages: Record<string, typeof zhMessages> = {
  zh: zhMessages,
  en: enMessages,
};

function onError(error: { code: string }) {
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    // Missing translations are expected and should only log an error
    console.error(error);
  } else {
    // Other errors indicate a bug in the app and should be reported
    console.error(error);
  }
}

function getMessageFallback({ namespace, key }: { namespace?: string; key: string }) {
  return namespace ? `${namespace}.${key}` : key;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'zh';
    setLocale(savedLocale);
    setMounted(true);
  }, []);

  // 避免 hydration 不匹配
  if (!mounted) {
    return (
      <NextIntlClientProvider
        locale="zh"
        messages={messages.zh}
        timeZone="Asia/Shanghai"
        onError={onError}
        getMessageFallback={getMessageFallback}
      >
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages[locale] || messages.zh}
      timeZone="Asia/Shanghai"
      onError={onError}
      getMessageFallback={getMessageFallback}
    >
      {children}
    </NextIntlClientProvider>
  );
}
