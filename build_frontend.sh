#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
NC='\033[0m' # 无色

echo -e "${GREEN}📦 正在安装依赖...${NC}"
npm install

echo -e "${GREEN}🔧 正在构建前端项目...${NC}"
npm run build

# 检查是否构建成功
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ 构建失败，请检查错误信息。${NC}"
  exit 1
fi

# 输出打包路径（Vue 通常是 dist，React 是 build）
if [ -d "dist" ]; then
  OUTPUT="dist"
elif [ -d "build" ]; then
  OUTPUT="build"
else
  echo -e "${RED}⚠️ 未找到打包目录（dist 或 build）。${NC}"
  exit 1
fi

echo -e "${GREEN}✅ 构建成功，输出目录：$OUTPUT${NC}"
