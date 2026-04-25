# Nápad: Nadiktuj nákup

## Zdroj
https://www.rohlik.cz/stranka/mcp-server — Rohlik.cz má MCP server.

## Problém
Ne každý má AI asistenta. Ale každý má hlas.

## Řešení
Stránka, na kterou někdo přijde, namluví co mu doma chybí → Claude to zpracuje přes Rohlik MCP server a naháže zboží přímo do košíku.

## Nápady na rozšíření
- Na přihlašovací stránce by mohl uživatel číst příkazy nahlas (voice input místo psaní)
- Možná i bez přihlášení — jen sdílený link na košík

## TODO
- Prozkoumat Rohlik MCP server API (co umí, autorizace)
- Voice input v prohlížeči (Web Speech API nebo Whisper)
- Jak předat výsledek do Rohlik košíku (redirect? odkaz?)
