'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function LanguageChanger() {
    const [locale, setLocale] = useState('zh');

    useEffect(() => {
        // 从 localStorage 读取语言设置
        const savedLocale = localStorage.getItem('locale') || 'zh';
        setLocale(savedLocale);
    }, []);

    const changeLanguage = (newLocale: string) => {
        // 保存到 localStorage
        localStorage.setItem('locale', newLocale);
        setLocale(newLocale);
        // 刷新页面以应用新语言
        window.location.reload();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline" size="icon">
                    <Languages />
                </Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent >
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    English {locale === 'en' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('zh')}>
                    简体中文 {locale === 'zh' && '✓'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}