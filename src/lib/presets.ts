import type { OptionGroup, Store } from "./types";

export const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=72&auto=format&fit=crop`;

const pizzaSize: OptionGroup = {
  id: "tam", name: "Tamanho", min: 1, max: 1,
  choices: [
    { name: "Broto (4 fatias)", price: -20 },
    { name: "Média (6 fatias)", price: -10 },
    { name: "Grande (8 fatias)", price: 0 },
    { name: "Gigante (12 fatias)", price: 18 },
  ],
};
const pizzaHalf: OptionGroup = {
  id: "meia", name: "Meio a meio (opcional)", min: 0, max: 1,
  choices: ["Margherita", "Calabresa", "Pepperoni", "Portuguesa", "Quatro queijos", "Rúcula com tomate seco"].map(
    (n) => ({ name: `Metade ${n}`, price: 0 }),
  ),
};
const pizzaCrust: OptionGroup = {
  id: "borda", name: "Borda", min: 0, max: 1,
  choices: [
    { name: "Borda de catupiry", price: 10 },
    { name: "Borda de cheddar", price: 10 },
    { name: "Borda de chocolate", price: 12 },
  ],
};

const burgerPoint: OptionGroup = {
  id: "ponto", name: "Ponto da carne", min: 1, max: 1,
  choices: [
    { name: "Mal passado", price: 0 },
    { name: "Ao ponto", price: 0 },
    { name: "Bem passado", price: 0 },
  ],
};
const burgerExtras: OptionGroup = {
  id: "add", name: "Adicionais (até 4)", min: 0, max: 4,
  choices: [
    { name: "Bacon extra", price: 6 },
    { name: "Cheddar extra", price: 5 },
    { name: "Ovo", price: 3 },
    { name: "Cebola caramelizada", price: 4 },
    { name: "Carne extra 150 g", price: 12 },
  ],
};
const combo: OptionGroup = {
  id: "combo", name: "Vira combo?", min: 0, max: 1,
  choices: [{ name: "Combo: batata média + refri lata", price: 16 }],
};

const sizes = (list = ["P", "M", "G", "GG"]): OptionGroup => ({
  id: "tam", name: "Tamanho", min: 1, max: 1, choices: list.map((n) => ({ name: n, price: 0 })),
});
const colors = (list: string[]): OptionGroup => ({
  id: "cor", name: "Cor", min: 1, max: 1, choices: list.map((n) => ({ name: n, price: 0 })),
});

const sweetSize: OptionGroup = {
  id: "tam", name: "Tamanho", min: 1, max: 1,
  choices: [
    { name: "300 ml", price: -6 },
    { name: "500 ml", price: 0 },
    { name: "700 ml", price: 7 },
  ],
};
const acaiTops: OptionGroup = {
  id: "comp", name: "Complementos (até 5)", min: 0, max: 5,
  choices: [
    { name: "Banana", price: 0 },
    { name: "Granola", price: 0 },
    { name: "Leite em pó", price: 0 },
    { name: "Morango", price: 3 },
    { name: "Nutella", price: 6 },
    { name: "Paçoca", price: 2 },
  ],
};

export const PRESETS: Store[] = [
  {
    key: "pizzaria",
    segment: "Pizzaria",
    name: "Forno da Vila",
    tagline: "Pizza de fermentação longa, assada na lenha.",
    cover: img("1763647836753-e06fe1f8707b", 1600),
    heroImage: img("1513104890138-7c749659a591", 1100),
    city: "Asa Norte, Brasília",
    whatsapp: "",
    instagram: "@fornodavila",
    hours: "Ter a dom, 18h às 23h30",
    open: true,
    eta: "40 a 55 min",
    deliveryFee: 7,
    minOrder: 35,
    delivery: true,
    pickup: true,
    payments: ["Pix", "Cartão na entrega", "Dinheiro"],
    mode: "pedido",
    labels: { add: "Adicionar", bag: "Sacola", cta: "Fazer pedido" },
    theme: {
      accent: "#C8321F", onAccent: "#FFF6E9", bg: "#FFFDF9", surface: "#FFFFFF",
      text: "#2B1810", muted: "#7D6656", line: "#EFE3D3", font: "trattoria", corners: "redondo", style: "cardapio",
    },
    categories: [
      { id: "trad", name: "Tradicionais" },
      { id: "esp", name: "Especiais" },
      { id: "doce", name: "Doces" },
      { id: "beb", name: "Bebidas" },
    ],
    products: [
      { id: "p1", cat: "trad", name: "Margherita", desc: "Molho de tomate italiano, muçarela de búfala, manjericão fresco e azeite.", price: 59, image: img("1574071318508-1cdbab80d002"), badge: "Mais pedida", options: [pizzaSize, pizzaHalf, pizzaCrust] },
      { id: "p2", cat: "trad", name: "Calabresa", desc: "Calabresa artesanal fatiada, cebola roxa e azeitona preta.", price: 54, image: img("1628840042765-356cda07504e"), options: [pizzaSize, pizzaHalf, pizzaCrust] },
      { id: "p3", cat: "trad", name: "Pepperoni", desc: "Pepperoni levemente picante sobre muçarela gratinada.", price: 62, image: img("1534308983496-4fabb1a015ee"), options: [pizzaSize, pizzaHalf, pizzaCrust] },
      { id: "p4", cat: "trad", name: "Portuguesa", desc: "Presunto, ovo, cogumelos, cebola, azeitona e muçarela.", price: 58, image: img("1604382354936-07c5d9983bd3"), options: [pizzaSize, pizzaHalf, pizzaCrust] },
      { id: "p5", cat: "esp", name: "Quatro queijos", desc: "Muçarela, gorgonzola, parmesão e catupiry original.", price: 66, image: img("1593504049359-74330189a345"), options: [pizzaSize, pizzaHalf, pizzaCrust] },
      { id: "p6", cat: "esp", name: "Rúcula com tomate seco", desc: "Muçarela, rúcula fresca, tomate seco e lascas de parmesão.", price: 64, oldPrice: 72, image: img("1593560708920-61dd98c46a4e"), badge: "Promoção", options: [pizzaSize, pizzaHalf, pizzaCrust] },
      { id: "p7", cat: "esp", name: "Calzone da casa", desc: "Fechado e recheado com presunto, muçarela, tomate e orégano.", price: 48, image: img("1753656681797-3234c89d6d4d") },
      { id: "p8", cat: "doce", name: "Brownie com sorvete", desc: "Brownie de chocolate meio amargo, quentinho, com bola de creme.", price: 22, image: img("1515037893149-de7f840978e2") },
      { id: "p9", cat: "beb", name: "Refrigerante 2 L", desc: "Cola, guaraná ou laranja. Bem gelado.", price: 14, image: img("1629186235045-80d4147d90dc"), options: [{ id: "sab", name: "Sabor", min: 1, max: 1, choices: [{ name: "Cola", price: 0 }, { name: "Guaraná", price: 0 }, { name: "Laranja", price: 0 }] }] },
      { id: "p10", cat: "beb", name: "Suco natural 500 ml", desc: "Laranja espremida na hora.", price: 12, image: img("1600271886742-f049cd451bba") },
    ],
  },
  {
    key: "hamburgueria",
    segment: "Hamburgueria",
    name: "Brasa Burger",
    tagline: "Blend próprio, pão brioche e fogo de verdade.",
    cover: img("1610970878459-a0e464d7592b", 1600),
    city: "Águas Claras, Brasília",
    whatsapp: "",
    instagram: "@brasaburger",
    hours: "Todos os dias, 18h às 0h",
    open: true,
    eta: "30 a 45 min",
    deliveryFee: 6,
    minOrder: 30,
    delivery: true,
    pickup: true,
    payments: ["Pix", "Cartão na entrega", "Dinheiro"],
    mode: "pedido",
    labels: { add: "Quero", bag: "Pedido", cta: "Fechar pedido" },
    theme: {
      accent: "#D7261E", onAccent: "#FFFFFF", bg: "#F6C445", surface: "#FFF7DF",
      text: "#1A1A1A", muted: "#5A4A1E", line: "#1A1A1A", font: "poster", corners: "reto", style: "poster",
    },
    categories: [
      { id: "burg", name: "Burgers" },
      { id: "acomp", name: "Acompanhamentos" },
      { id: "shake", name: "Shakes" },
      { id: "beb", name: "Bebidas" },
    ],
    products: [
      { id: "b1", cat: "burg", name: "Brasa Clássico", desc: "Blend 160 g, queijo prato, alface, tomate, cebola roxa e maionese da casa.", price: 32, image: img("1568901346375-23c9450c58cd"), badge: "Mais pedido", options: [burgerPoint, burgerExtras, combo] },
      { id: "b2", cat: "burg", name: "Duplo Cheddar", desc: "Dois blends de 120 g, cheddar cremoso em dobro e picles.", price: 39, image: img("1572802419224-296b0aeee0d9"), options: [burgerPoint, burgerExtras, combo] },
      { id: "b3", cat: "burg", name: "Bacon Lover", desc: "Blend 160 g, bacon crocante, cheddar e barbecue defumado.", price: 38, image: img("1610440042657-612c34d95e9f"), options: [burgerPoint, burgerExtras, combo] },
      { id: "b4", cat: "burg", name: "Smash da Casa", desc: "Dois smash de 80 g, queijo americano, cebola na chapa.", price: 29, oldPrice: 34, image: img("1757834787931-ddd70f3379a5"), badge: "Promoção", options: [burgerExtras, combo] },
      { id: "b5", cat: "burg", name: "Salada Fit", desc: "Blend 160 g, muito alface, tomate, queijo branco e molho de iogurte.", price: 33, image: img("1586190848861-99aa4a171e90"), options: [burgerPoint, burgerExtras, combo] },
      { id: "b6", cat: "acomp", name: "Batata rústica", desc: "Porção de 300 g com páprica e maionese verde.", price: 19, image: img("1630384060421-cb20d0e0649d"), options: [{ id: "mol", name: "Molho extra", min: 0, max: 2, choices: [{ name: "Cheddar e bacon", price: 7 }, { name: "Barbecue", price: 3 }] }] },
      { id: "b7", cat: "acomp", name: "Onion rings", desc: "Anéis de cebola empanados, sequinhos.", price: 21, image: img("1639024471283-03518883512d") },
      { id: "b8", cat: "shake", name: "Shake de Ovomaltine", desc: "Sorvete de creme batido com Ovomaltine crocante, 400 ml.", price: 22, image: img("1572490122747-3968b75cc699") },
      { id: "b9", cat: "shake", name: "Shake de morango", desc: "Morango de verdade com sorvete de creme, 400 ml.", price: 21, image: img("1579954115545-a95591f28bfc") },
      { id: "b10", cat: "beb", name: "Refri lata", desc: "350 ml, vários sabores.", price: 7, image: img("1581636625402-29b2a704ef13") },
    ],
  },
  {
    key: "lanchonete",
    segment: "Lanchonete",
    name: "Cantinho do Zé",
    tagline: "Lanche caprichado, suco na hora e açaí do jeito que você gosta.",
    cover: img("1655279562015-047c3da9a271", 1600),
    city: "Taguatinga, Brasília",
    whatsapp: "",
    instagram: "@cantinhodoze",
    hours: "Seg a sáb, 7h às 20h",
    open: true,
    eta: "25 a 40 min",
    deliveryFee: 5,
    minOrder: 20,
    delivery: true,
    pickup: true,
    payments: ["Pix", "Cartão na entrega", "Dinheiro"],
    mode: "pedido",
    labels: { add: "Pôr na sacola", bag: "Sacola", cta: "Pedir agora" },
    theme: {
      accent: "#0F6B45", onAccent: "#FFFFFF", bg: "#F7F8F4", surface: "#FFFFFF",
      text: "#17271F", muted: "#5B6A61", line: "#DDE5DF", font: "bairro", corners: "redondo", style: "bairro",
    },
    categories: [
      { id: "lanche", name: "Lanches" },
      { id: "dog", name: "Cachorro-quente" },
      { id: "acai", name: "Açaí" },
      { id: "suco", name: "Sucos" },
      { id: "doce", name: "Doces" },
    ],
    products: [
      { id: "l1", cat: "lanche", name: "Misto quente na chapa", desc: "Pão de forma, presunto e queijo derretido, bem tostado.", price: 12, image: img("1528735602780-2552fd46c7af") },
      { id: "l2", cat: "lanche", name: "Sanduíche natural", desc: "Frango desfiado, cenoura, alface e requeijão no pão integral.", price: 15, image: img("1553909489-cd47e0907980"), badge: "Leve" },
      { id: "l3", cat: "lanche", name: "Ciabatta italiana", desc: "Salame, muçarela, tomate e rúcula na ciabatta.", price: 24, image: img("1785960072671-adedfa5d9fc8") },
      { id: "l4", cat: "dog", name: "Dog tradicional", desc: "Salsicha, molho, milho, batata palha, ketchup e mostarda.", price: 13, image: img("1638368593249-7cadb261e8b3"), options: [{ id: "add", name: "Adicionais", min: 0, max: 3, choices: [{ name: "Salsicha extra", price: 3 }, { name: "Queijo ralado", price: 2 }, { name: "Purê", price: 3 }] }] },
      { id: "l5", cat: "dog", name: "Dog completo", desc: "Duas salsichas, purê, queijo, vinagrete e batata palha.", price: 18, image: img("1612392166886-ee8475b03af2"), badge: "Mais pedido" },
      { id: "l6", cat: "acai", name: "Açaí no copo", desc: "Açaí cremoso batido na hora. Monte do seu jeito.", price: 18, image: img("1771371000586-33abd2ce9e23"), options: [sweetSize, acaiTops] },
      { id: "l7", cat: "suco", name: "Suco de laranja", desc: "Espremido na hora, sem açúcar.", price: 9, image: img("1600271886742-f049cd451bba"), options: [sweetSize] },
      { id: "l8", cat: "suco", name: "Suco de morango", desc: "Morango batido com água ou leite.", price: 10, image: img("1614707585284-9cb9fc018387"), options: [sweetSize, { id: "base", name: "Batido com", min: 1, max: 1, choices: [{ name: "Água", price: 0 }, { name: "Leite", price: 2 }] }] },
      { id: "l9", cat: "suco", name: "Suco de manga", desc: "Manga madura, bem geladinho.", price: 10, image: img("1546173159-315724a31696"), options: [sweetSize] },
      { id: "l10", cat: "doce", name: "Brownie com calda", desc: "Brownie molhadinho com calda de chocolate.", price: 11, image: img("1606313564200-e75d5e30476c") },
    ],
  },
  {
    key: "roupas",
    segment: "Loja de roupas",
    name: "Atelier Norte",
    tagline: "Peças básicas bem cortadas, para usar todo dia.",
    cover: img("1441984904996-e0b6ba687e04", 1600),
    city: "Sudoeste, Brasília",
    whatsapp: "",
    instagram: "@ateliernorte",
    hours: "Seg a sáb, 10h às 20h",
    open: true,
    eta: "Entrega em até 2 dias úteis",
    deliveryFee: 15,
    minOrder: 0,
    delivery: true,
    pickup: true,
    payments: ["Pix (5% off)", "Cartão em até 6x", "Link de pagamento"],
    mode: "pedido",
    labels: { add: "Adicionar à sacola", bag: "Sacola", cta: "Finalizar compra" },
    theme: {
      accent: "#5B5F3A", onAccent: "#FFFFFF", bg: "#ECE8E1", surface: "#F6F3EE",
      text: "#1A1A1A", muted: "#6E6960", line: "#D6D0C5", font: "elegante", corners: "reto", style: "editorial",
    },
    categories: [
      { id: "cam", name: "Camisetas" },
      { id: "cas", name: "Casacos" },
      { id: "cal", name: "Calças" },
      { id: "ves", name: "Vestidos" },
      { id: "ace", name: "Tênis e acessórios" },
    ],
    products: [
      { id: "r1", cat: "cam", name: "Camiseta Essencial Branca", desc: "Algodão peruano 30.1, gola careca reforçada, caimento reto.", price: 89, image: img("1581655353564-df123a1eb820"), badge: "Mais vendida", options: [sizes()] },
      { id: "r2", cat: "cam", name: "Camiseta Essencial Preta", desc: "A mesma modelagem da branca, em preto que não desbota.", price: 89, image: img("1583743814966-8936f5b7be1a"), options: [sizes()] },
      { id: "r3", cat: "cas", name: "Moletom Canguru Mescla", desc: "Moletom felpado por dentro, bolso canguru e capuz duplo.", price: 219, oldPrice: 259, image: img("1556821840-3a63f95609a7"), badge: "-15%", options: [sizes()] },
      { id: "r4", cat: "cas", name: "Jaqueta Jeans Clássica", desc: "Jeans 100% algodão, lavagem média, botões de metal.", price: 279, image: img("1611312449408-fcece27cdbb7"), options: [sizes()] },
      { id: "r5", cat: "cas", name: "Jaqueta de Couro Biker", desc: "Couro legítimo, zíper assimétrico, forro de cetim.", price: 649, image: img("1551028719-00167b16eac5"), options: [sizes(["P", "M", "G"])] },
      { id: "r6", cat: "cas", name: "Bomber Caramelo", desc: "Nylon fosco com punhos canelados. Leve e quentinha.", price: 299, image: img("1591047139829-d91aecb6caea"), options: [sizes()] },
      { id: "r7", cat: "cal", name: "Calça Jeans Reta", desc: "Cintura média, perna reta, jeans com leve elastano.", price: 229, image: img("1602293589930-45aad59ba3ab"), options: [sizes(["36", "38", "40", "42", "44", "46"])] },
      { id: "r8", cat: "ves", name: "Vestido Midi Vermelho", desc: "Viscose fluida, alça fina e fenda lateral.", price: 259, image: img("1595777457583-95e059d581b8"), badge: "Novo", options: [sizes(["PP", "P", "M", "G"])] },
      { id: "r9", cat: "ves", name: "Vestido de Renda Areia", desc: "Renda com bordado dourado, forro completo.", price: 389, image: img("1623609163859-ca93c959b98a"), options: [sizes(["PP", "P", "M", "G"])] },
      { id: "r10", cat: "ace", name: "Tênis Couro Branco", desc: "Couro, sola costurada, palmilha macia.", price: 349, image: img("1600269452121-4f2416e55c28"), options: [sizes(["36", "37", "38", "39", "40", "41", "42", "43"])] },
      { id: "r11", cat: "ace", name: "Boné Aba Curva", desc: "Sarja de algodão, regulagem de metal.", price: 99, image: img("1588850561407-ed78c282e89b"), options: [colors(["Off-white", "Preto", "Cinza"])] },
    ],
  },
  {
    key: "carros",
    segment: "Loja de carros",
    name: "Prime Seminovos",
    tagline: "Seminovos revisados, com laudo cautelar e garantia de 1 ano.",
    cover: img("1777175013302-eaf4b3ef785a", 1600),
    city: "SIA, Brasília",
    whatsapp: "",
    instagram: "@primeseminovos",
    hours: "Seg a sex, 9h às 18h · sáb, 9h às 14h",
    open: true,
    eta: "Visita com hora marcada",
    deliveryFee: 0,
    minOrder: 0,
    delivery: false,
    pickup: true,
    payments: ["Financiamento", "À vista", "Seu carro na troca"],
    mode: "interesse",
    labels: { add: "Tenho interesse", bag: "Interesses", cta: "Falar com vendedor" },
    theme: {
      accent: "#E5322D", onAccent: "#FFFFFF", bg: "#EEF0F2", surface: "#FFFFFF",
      text: "#15181C", muted: "#66707C", line: "#D9DDE2", font: "pista", corners: "suave", style: "showroom",
    },
    categories: [
      { id: "suv", name: "SUVs" },
      { id: "sed", name: "Sedãs" },
      { id: "hat", name: "Hatches" },
      { id: "pic", name: "Picapes" },
    ],
    products: [
      { id: "c1", cat: "suv", name: "Jeep Wrangler Sahara 2.0 Turbo", desc: "4x4, capota rígida removível, central multimídia, revisões na concessionária.", price: 329900, image: img("1506015391300-4802dc74de2e"), badge: "Único dono", specs: [["Ano", "2022/2022"], ["Km", "28.400"], ["Câmbio", "Automático"], ["Combustível", "Gasolina"], ["Cor", "Preto"]] },
      { id: "c2", cat: "suv", name: "Toyota Land Cruiser Prado VX", desc: "4x4 de verdade, 7 lugares, bancos em couro e teto solar.", price: 489900, image: img("1622893288761-823ba60f17a6"), specs: [["Ano", "2021/2021"], ["Km", "41.900"], ["Câmbio", "Automático 9 marchas"], ["Combustível", "Diesel"], ["Cor", "Cinza"]] },
      { id: "c3", cat: "sed", name: "BMW 320i M Sport", desc: "Painel digital, faróis full LED, assistente de estacionamento.", price: 249900, oldPrice: 262900, image: img("1555215695-3004980ad54e"), badge: "Baixou o preço", specs: [["Ano", "2022/2023"], ["Km", "19.300"], ["Câmbio", "Automático"], ["Combustível", "Flex"], ["Cor", "Branco"]] },
      { id: "c4", cat: "sed", name: "Mercedes-Benz C 200 Avantgarde", desc: "Interior em couro, piloto automático adaptativo, câmera de ré.", price: 219900, image: img("1619767886558-efdc259cde1a"), specs: [["Ano", "2021/2021"], ["Km", "36.000"], ["Câmbio", "Automático"], ["Combustível", "Gasolina"], ["Cor", "Preto"]] },
      { id: "c5", cat: "sed", name: "Sedã Executivo 2.0", desc: "Espaço de sobra no banco de trás, porta-malas de 520 L e baixo consumo.", price: 139900, image: img("1560009320-c01920eef9f8"), specs: [["Ano", "2023/2023"], ["Km", "12.800"], ["Câmbio", "CVT"], ["Combustível", "Flex"], ["Cor", "Azul"]] },
      { id: "c6", cat: "hat", name: "Volkswagen Polo Highline TSI", desc: "Turbo, econômico, com central VW Play e alerta de ponto cego.", price: 98900, image: img("1541899481282-d53bffe3c35d"), badge: "Mais procurado", specs: [["Ano", "2023/2024"], ["Km", "15.200"], ["Câmbio", "Automático"], ["Combustível", "Flex"], ["Cor", "Azul"]] },
      { id: "c7", cat: "hat", name: "Hatch Compacto 1.0 Turbo", desc: "Ideal pra cidade: fácil de estacionar e muito econômico.", price: 79900, image: img("1471444928139-48c5bf5173f8"), specs: [["Ano", "2022/2022"], ["Km", "33.700"], ["Câmbio", "Manual"], ["Combustível", "Flex"], ["Cor", "Preto"]] },
      { id: "c8", cat: "pic", name: "RAM 1500 Laramie", desc: "V8 5.7 Hemi, caçamba com capota marítima, bancos ventilados.", price: 429900, image: img("1649793395985-967862a3b73f"), specs: [["Ano", "2022/2022"], ["Km", "38.100"], ["Câmbio", "Automático"], ["Combustível", "Gasolina"], ["Cor", "Prata"]] },
      { id: "c9", cat: "pic", name: "Toyota Tacoma TRD Off-Road", desc: "4x4 com bloqueio de diferencial, pronta pra trilha.", price: 359900, image: img("1559416523-140ddc3d238c"), specs: [["Ano", "2021/2021"], ["Km", "47.500"], ["Câmbio", "Automático"], ["Combustível", "Gasolina"], ["Cor", "Areia"]] },
    ],
  },
];

export const presetByKey = (k: string) => PRESETS.find((p) => p.key === k) ?? PRESETS[0];
