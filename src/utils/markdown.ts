import React from 'react';

export const formatCodeBlocks = (content: string): string => {
  // Add syntax highlighting classes to code blocks
  return content.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, language, code) => {
      const lang = language || 'text';
      return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
    }
  );
};

export const extractCodeBlocks = (content: string): Array<{ language: string; code: string; index: number }> => {
  const codeBlocks: Array<{ language: string; code: string; index: number }> = [];
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  let index = 0;

  while ((match = regex.exec(content)) !== null) {
    codeBlocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
      index: index++
    });
  }

  return codeBlocks;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
};