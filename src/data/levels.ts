export interface LevelInfo {
  id: number;
  name: string;
  place: string;
  emoji: string;
  seconds: number;
  colorClass: string;
}

export const LEVELS: LevelInfo[] = [
  { id: 1, name: "Khu Rừng Khởi Đầu", place: "Cánh cổng xanh", emoji: "🌳", seconds: 30, colorClass: "forest" },
  { id: 2, name: "Dòng Sông Bí Ẩn", place: "Cầu cầu vồng", emoji: "🌊", seconds: 27, colorClass: "river" },
  { id: 3, name: "Núi Băng", place: "Thung lũng tuyết", emoji: "🏔️", seconds: 24, colorClass: "ice" },
  { id: 4, name: "Núi Lửa", place: "Hang dung nham", emoji: "🌋", seconds: 21, colorClass: "volcano" },
  { id: 5, name: "Lâu Đài Cổ", place: "Cổng thành", emoji: "🏰", seconds: 18, colorClass: "castle" },
  { id: 6, name: "Rừng Đêm", place: "Con đường sao", emoji: "🌙", seconds: 15, colorClass: "night" },
  { id: 7, name: "Hang Rồng", place: "Ổ rồng vàng", emoji: "🐉", seconds: 12, colorClass: "dragon" },
  { id: 8, name: "Thành Trì Bóng Tối", place: "Pháo đài", emoji: "⚔️", seconds: 10, colorClass: "fortress" },
  { id: 9, name: "Vương Quốc Bóng Tối", place: "Cổng hắc ám", emoji: "🌌", seconds: 7, colorClass: "dark" },
  { id: 10, name: "Lâu Đài Công Chúa", place: "Trận chiến cuối", emoji: "👑", seconds: 5, colorClass: "final" },
];