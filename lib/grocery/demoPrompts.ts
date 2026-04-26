// Demo prompts keep example copy and explanations out of page components.
export interface DemoPrompt {
  id: string;
  text: string;
  explanation: string;
}

export const demoPrompts: DemoPrompt[] = [
  {
    id: "rychla-vecere",
    text: "Chybí mi mléko, vajíčka, banány a něco rychlého k večeři.",
    explanation:
      "Aplikace našla konkrétní položky a výraz o rychlé večeři převedla na jednoduchý návrh jídla.",
  },
  {
    id: "snidane-deti",
    text: "Potřebuju věci na snídani pro dvě děti na tři dny.",
    explanation:
      "Požadavek bere jako snídaňový nákup pro děti a přidává orientační množství na více dnů.",
  },
  {
    id: "zakladni-potraviny",
    text: "Doplň mi základní potraviny: pečivo, máslo, šunku, sýr a jogurty.",
    explanation:
      "Parser rozpoznal vyjmenované potraviny a zařadil je do základních kategorií.",
  },
  {
    id: "zdravy-obed",
    text: "Chci něco zdravého k obědu a ovoce na celý týden.",
    explanation:
      "Zdravý oběd převádí na bílkovinu, přílohu a zeleninu, ovoce navyšuje na týdenní nákup.",
  },
];
