import { defineConfig } from "vitest/config";
import path from "node:path";

/*
  Юнит-тесты для чистой логики: подпись платежей, допуск в админку,
  фильтры каталога, адрес сайта. Без окружения браузера — это не тесты
  компонентов, а тесты функций, которым он не нужен.
*/
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      /*
        Vite резолвит зависимости через условие "browser" даже в
        node-окружении тестов, а у server-only ровно на этом условии
        висит модуль, который бросает исключение при импорте из клиента.
        Тесты — не браузер и не сервер Next.js, а обычный Node; здесь
        server-only можно смело заменить на пустышку.
      */
      "server-only": path.resolve(__dirname, "src/test/server-only-stub.ts"),
    },
  },
});
