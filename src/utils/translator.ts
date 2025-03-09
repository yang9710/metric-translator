import { camelCase, snakeCase, upperCase } from 'lodash-es';

export type NamingStyle = 'camelCase' | 'snakeCase' | 'constantCase' | 'pascalCase' | 'kebabCase';

export interface TranslationResult {
  text: string;
  source: 'MyMemory' | 'Google' | 'Original';
}

export class NameTranslator {
  private async translateWithMyMemory(text: string): Promise<TranslationResult> {
    try {
      // 使用 MyMemory API 进行翻译
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh-CN|en`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('MyMemory 翻译请求失败');
      }

      const data = await response.json();

      // 检查翻译结果
      if (data.responseStatus === 200 && data.responseData) {
        return {
          text: data.responseData.translatedText,
          source: 'MyMemory'
        };
      } else {
        throw new Error('MyMemory 翻译结果无效');
      }
    } catch (error) {
      console.error('MyMemory 翻译出错:', error);
      throw error;
    }
  }

  private async translateWithGoogle(text: string): Promise<TranslationResult> {
    try {
      // 使用 Google 翻译 API 的免费代理
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(text)}`);

      if (!response.ok) {
        throw new Error('Google 翻译请求失败');
      }

      const data = await response.json();
      // 提取翻译结果
      return {
        text: data[0][0][0],
        source: 'Google'
      };
    } catch (error) {
      console.error('Google 翻译出错:', error);
      throw error;
    }
  }

  // 生成不同命名风格
  private formatName(text: string, style: NamingStyle): string {
    // 预处理：移除特殊字符，替换空格为下划线
    const processed = text.trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');

    switch (style) {
      case 'camelCase':
        return camelCase(processed);
      case 'snakeCase':
        return snakeCase(processed);
      case 'constantCase':
        return upperCase(processed);
      case 'pascalCase': {
        const camelCased = camelCase(processed);
        return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
      }
      case 'kebabCase':
        return snakeCase(processed).replace(/_/g, '-');
      default:
        return camelCase(processed);
    }
  }

  // 主转换方法
  async translate(input: string): Promise<{ [key: string]: TranslationResult[] }> {
    const results: { [key: string]: TranslationResult[] } = {
      'camelCase': [],
      'snakeCase': [],
      'constantCase': [],
      'pascalCase': [],
      'kebabCase': []
    };

    try {
      // 并行请求两个翻译 API
      const translationPromises = [
        this.translateWithMyMemory(input).catch(() => ({ text: input, source: 'Original' as const })),
        this.translateWithGoogle(input).catch(() => ({ text: input, source: 'Original' as const }))
      ];

      const translations = await Promise.all(translationPromises);

      // 为每个翻译结果生成不同命名风格
      for (const translation of translations) {
        if (translation.source !== 'Original') {
          results['camelCase'].push({
            text: this.formatName(translation.text, 'camelCase'),
            source: translation.source
          });

          results['snakeCase'].push({
            text: this.formatName(translation.text, 'snakeCase'),
            source: translation.source
          });

          results['constantCase'].push({
            text: this.formatName(translation.text, 'constantCase'),
            source: translation.source
          });

          results['pascalCase'].push({
            text: this.formatName(translation.text, 'pascalCase'),
            source: translation.source
          });

          results['kebabCase'].push({
            text: this.formatName(translation.text, 'kebabCase'),
            source: translation.source
          });
        }
      }

      return results;
    } catch (error) {
      console.error('处理失败:', error);
      return {
        'error': [{ text: 'error_occurred', source: 'Original' }]
      };
    }
  }
}