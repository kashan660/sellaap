const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categoryDescription =
    "Freshly built 3D game projects crafted by our in-house team. Includes popular gameplay styles and advanced systems such as multiplayer networking, multi-level progression, real-time chat, in-app purchases, rewards, leaderboards, cloud save, and admin tools for live operations.";

  const category = await prisma.category.upsert({
    where: { slug: "game-projects" },
    update: {
      name: "Game Projects",
      description: categoryDescription,
    },
    create: {
      slug: "game-projects",
      name: "Game Projects",
      description: categoryDescription,
    },
  });

  const products = [
    [
      "battle-royale-pro-3d",
      "Battle Royale Pro 3D",
      20000,
      "AAA-style battle royale foundation with polished combat loop, zone system, inventory, team modes, and scalable server-ready architecture. Fresh codebase with no resale history.",
    ],
    [
      "open-world-racer-3d",
      "Open World Racer 3D",
      18000,
      "High-performance open-world racing project with vehicle customization, physics tuning, mission progression, and monetization hooks. Fresh production-grade code.",
    ],
    [
      "multiplayer-survival-island-3d",
      "Multiplayer Survival Island 3D",
      16500,
      "Survival crafting experience featuring co-op multiplayer, resource systems, base building, and events. Built from scratch by our team with clean modular architecture.",
    ],
    [
      "fps-arena-esports-3d",
      "FPS Arena eSports 3D",
      15000,
      "Competitive FPS arena starter with ranking logic, anti-cheat-ready patterns, match flow, and spectator support. Fresh code and reusable backend-friendly structure.",
    ],
    [
      "city-builder-tycoon-3d",
      "City Builder Tycoon 3D",
      13500,
      "3D city simulation with economy balancing, upgrade trees, quest progression, and in-app purchase integration points. Newly developed code, not republished.",
    ],
    [
      "rpg-quest-chronicles-3d",
      "RPG Quest Chronicles 3D",
      12000,
      "Story-driven 3D RPG framework including skill trees, inventory, NPC interactions, and chapter progression. Clean foundation for expansion and live updates.",
    ],
    [
      "soccer-manager-online-3d",
      "Soccer Manager Online 3D",
      9500,
      "Online football manager project with squad building, leagues, transfer market logic, and social features. Fresh architecture with strong monetization potential.",
    ],
    [
      "kart-rush-multiplayer-3d",
      "Kart Rush Multiplayer 3D",
      7500,
      "Arcade kart racing game with real-time multiplayer, map rotation, cosmetics, and challenge modes. Newly engineered code for fast launch cycles.",
    ],
    [
      "zombie-wave-defense-3d",
      "Zombie Wave Defense 3D",
      4500,
      "Wave-defense shooter with progression economy, skill perks, boss logic, and event system. Freshly built project suitable for rapid publishing.",
    ],
    [
      "hypercasual-stack-runner-3d",
      "Hypercasual Stack Runner 3D",
      2000,
      "Fast-to-market hypercasual 3D runner with ad-ready loops, level generation, and retention hooks. Lightweight and optimized for iteration.",
    ],
  ];

  for (const [slug, name, price, description] of products) {
    await prisma.product.upsert({
      where: { slug },
      update: {
        name,
        description,
        price,
        currency: "USD",
        categoryId: category.id,
        fallbackImage: "/placeholder.png",
        isFeatured: false,
      },
      create: {
        slug,
        name,
        description,
        price,
        currency: "USD",
        categoryId: category.id,
        fallbackImage: "/placeholder.png",
        isFeatured: false,
      },
    });
  }

  // Entry-level game products requested by client
  await prisma.product.upsert({
    where: { slug: "arcade-shooter-starter-3d" },
    update: {
      name: "Arcade Shooter Starter 3D",
      description:
        "Fresh 3D arcade shooter starter project with clean architecture, level loop, score system, and extensible gameplay modules.",
      price: 500,
      currency: "USD",
      categoryId: category.id,
      image: "/images/iptv.svg", // original image
      fallbackImage: "/images/vpn.svg", // alt image
      isFeatured: false,
    },
    create: {
      slug: "arcade-shooter-starter-3d",
      name: "Arcade Shooter Starter 3D",
      description:
        "Fresh 3D arcade shooter starter project with clean architecture, level loop, score system, and extensible gameplay modules.",
      price: 500,
      currency: "USD",
      categoryId: category.id,
      image: "/images/iptv.svg", // original image
      fallbackImage: "/images/vpn.svg", // alt image
      isFeatured: false,
    },
  });

  await prisma.product.upsert({
    where: { slug: "platformer-adventure-kit-3d" },
    update: {
      name: "Platformer Adventure Kit 3D",
      description:
        "Newly built 3D platformer project with multilevel progression, checkpoint system, enemy AI basics, and monetization-ready structure.",
      price: 1000,
      currency: "USD",
      categoryId: category.id,
      image: "/images/firestick-usa.svg", // original image
      fallbackImage: "/images/remote.svg", // alt image
      isFeatured: false,
    },
    create: {
      slug: "platformer-adventure-kit-3d",
      name: "Platformer Adventure Kit 3D",
      description:
        "Newly built 3D platformer project with multilevel progression, checkpoint system, enemy AI basics, and monetization-ready structure.",
      price: 1000,
      currency: "USD",
      categoryId: category.id,
      image: "/images/firestick-usa.svg", // original image
      fallbackImage: "/images/remote.svg", // alt image
      isFeatured: false,
    },
  });

  await prisma.product.upsert({
    where: { slug: "custom-exclusive-3d-game-build" },
    update: {
      name: "Custom Exclusive 3D Game Build (Private Ownership)",
      description:
        "A fully custom-built 3D game made only for one buyer. The code is never published on any marketplace or website. Buyer gets exclusive ownership delivery. Budget is flexible from USD 2,000 to USD 50,000 depending on scope and requested features.",
      price: 2000,
      currency: "USD",
      categoryId: category.id,
      fallbackImage: "/placeholder.png",
      isFeatured: true,
    },
    create: {
      slug: "custom-exclusive-3d-game-build",
      name: "Custom Exclusive 3D Game Build (Private Ownership)",
      description:
        "A fully custom-built 3D game made only for one buyer. The code is never published on any marketplace or website. Buyer gets exclusive ownership delivery. Budget is flexible from USD 2,000 to USD 50,000 depending on scope and requested features.",
      price: 2000,
      currency: "USD",
      categoryId: category.id,
      fallbackImage: "/placeholder.png",
      isFeatured: true,
    },
  });

  await prisma.page.upsert({
    where: { slug: "custom-game-ownership" },
    update: {
      title: "Custom Exclusive 3D Game Ownership",
      excerpt:
        "Commission a private, never-published 3D game project built only for your brand and audience.",
      content:
        "<h2>Private Custom Game Development</h2><p>We build a completely fresh 3D game project based on your concept, business model, and timeline. This project is never published on public marketplaces.</p><h3>Included Capabilities</h3><ul><li>Multiplayer support</li><li>Multi-level progression</li><li>Chat and social systems</li><li>In-app purchases</li><li>Admin and analytics hooks</li></ul><h3>Budget Range</h3><p>Typical budget: <strong>USD 2,000 to USD 50,000</strong> based on features and delivery schedule.</p><p>For ordering, please provide your email so we can share milestone updates, delivery documents, and source access details.</p><p><a href=\"/custom-game-order\">Start Custom Game Order</a></p>",
      status: "PUBLISHED",
      template: "product",
      metaTitle: "Custom Exclusive 3D Game Development | Private Ownership",
      metaDescription:
        "Order a never-published custom 3D game project with private ownership and clean source delivery.",
      metaKeywords:
        "custom 3d game development, exclusive source code, private ownership game, multiplayer game project",
    },
    create: {
      slug: "custom-game-ownership",
      title: "Custom Exclusive 3D Game Ownership",
      excerpt:
        "Commission a private, never-published 3D game project built only for your brand and audience.",
      content:
        "<h2>Private Custom Game Development</h2><p>We build a completely fresh 3D game project based on your concept, business model, and timeline. This project is never published on public marketplaces.</p><h3>Included Capabilities</h3><ul><li>Multiplayer support</li><li>Multi-level progression</li><li>Chat and social systems</li><li>In-app purchases</li><li>Admin and analytics hooks</li></ul><h3>Budget Range</h3><p>Typical budget: <strong>USD 2,000 to USD 50,000</strong> based on features and delivery schedule.</p><p>For ordering, please provide your email so we can share milestone updates, delivery documents, and source access details.</p><p><a href=\"/custom-game-order\">Start Custom Game Order</a></p>",
      status: "PUBLISHED",
      template: "product",
      metaTitle: "Custom Exclusive 3D Game Development | Private Ownership",
      metaDescription:
        "Order a never-published custom 3D game project with private ownership and clean source delivery.",
      metaKeywords:
        "custom 3d game development, exclusive source code, private ownership game, multiplayer game project",
    },
  });
}

main()
  .then(() => {
    console.log("Game projects seed completed.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
