import { useState } from "react";
import { BookOpen, Calculator, Cpu, Sparkles } from "lucide-react";

interface AlgorithmExplanationProps {
  currentDisks: number;
}

export function AlgorithmExplanation({ currentDisks }: AlgorithmExplanationProps) {
  const [activeTab, setActiveTab] = useState<"recursive" | "iterative" | "binary">("recursive");
  const minMoves = Math.pow(2, currentDisks) - 1;

  return (
    <section aria-labelledby="algorithm-heading" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="text-copper-400" size={20} />
          <h2 id="algorithm-heading" className="section-heading">
            Phân Tích Chuyên Sâu Các Phương Pháp Giải
          </h2>
        </div>

        {/* Algorithm Strategy Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("recursive")}
            className={`px-3 py-1 rounded transition ${
              activeTab === "recursive"
                ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            1. Đệ Quy (Chia để trị)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("iterative")}
            className={`px-3 py-1 rounded transition ${
              activeTab === "iterative"
                ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            2. Vòng Lặp (Bán chu kỳ)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("binary")}
            className={`px-3 py-1 rounded transition ${
              activeTab === "binary"
                ? "bg-copper-400/20 text-copper-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            3. Nhị Phân (Mã Gray)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Explanation Column */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === "recursive" && (
            <>
              <div className="instrument-panel p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-signal-blue" />
                  Bước cơ sở (Base Case: n = 1)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Khi chỉ có <strong className="text-white">1 đĩa</strong> duy nhất, không có đĩa nào cản trở phía trên. Ta có thể nhấc ngay đĩa này từ cọc Nguồn sang cọc Đích mà không cần dùng đến cọc trung gian.
                </p>
                <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-slate-300 border border-white/[0.06]">
                  <span className="text-copper-400">if</span> (n === 1) &#123;<br />
                  &nbsp;&nbsp;chuyenDia(source, target);<br />
                  &nbsp;&nbsp;<span className="text-copper-400">return</span>;<br />
                  &#125;
                </div>
              </div>

              <div className="instrument-panel p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-copper-400" />
                  Bước đệ quy (Recursive Case: n &gt; 1)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Để chuyển <strong className="text-white">n đĩa</strong> từ Cọc Nguồn sang Cọc Đích theo đúng luật, bài toán được phân rã thành 3 bài toán con nối tiếp nhau:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-300 pl-1">
                  <li>
                    <strong className="text-slate-100">Bước 1:</strong> Gọi đệ quy chuyển <code className="font-mono text-xs text-copper-300">n - 1</code> đĩa trên cùng từ <strong>Nguồn</strong> sang <strong>Trung Gian</strong> (dùng Đích làm đệm).
                  </li>
                  <li>
                    <strong className="text-slate-100">Bước 2:</strong> Chuyển chiếc đĩa lớn nhất thứ <code className="font-mono text-xs text-copper-300">n</code> trực tiếp từ <strong>Nguồn</strong> sang <strong>Đích</strong>.
                  </li>
                  <li>
                    <strong className="text-slate-100">Bước 3:</strong> Gọi đệ quy chuyển <code className="font-mono text-xs text-copper-300">n - 1</code> đĩa từ <strong>Trung Gian</strong> sang <strong>Đích</strong> (dùng Nguồn làm đệm).
                  </li>
                </ol>
                <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-slate-300 border border-white/[0.06] overflow-x-auto">
                  hanoi(n - 1, nguon, dich, trungGian); <span className="text-slate-500">// Bước 1</span><br />
                  chuyenDia(n, nguon, dich); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Bước 2</span><br />
                  hanoi(n - 1, trungGian, nguon, dich); <span className="text-slate-500">// Bước 3</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "iterative" && (
            <div className="instrument-panel p-5 space-y-3.5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Cpu className="text-copper-400" size={17} />
                Phương pháp Vòng lặp Không đệ quy (Iterative Algorithm)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Khi số đĩa n lớn, đệ quy có thể gây tràn ngăn xếp (Stack Overflow). Thuật toán vòng lặp giải bài toán chỉ với <strong className="text-signal-green">bộ nhớ phụ O(1)</strong> nhờ quy luật luân phiên:
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4 space-y-2.5 text-xs text-slate-300">
                <div className="font-semibold text-copper-300">Quy luật luân phiên 2 bước:</div>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li>
                    <strong>Ở các bước lẻ (1, 3, 5, ...):</strong> Luôn di chuyển <strong className="text-white">Đĩa nhỏ nhất (Đĩa 1)</strong> sang cọc tiếp theo theo vòng tròn:
                    <br />
                    <span className="font-mono text-copper-300 pl-4">
                      {currentDisks % 2 === 0 ? "A → B → C → A (khi n chẵn)" : "A → C → B → A (khi n lẻ)"}
                    </span>
                  </li>
                  <li>
                    <strong>Ở các bước chẵn (2, 4, 6, ...):</strong> Chỉ có duy nhất một nước đi hợp lệ giữa 2 cọc KHÔNG chứa Đĩa 1 (đặt đĩa nhỏ hơn lên đĩa lớn hơn).
                  </li>
                </ul>
              </div>
              <p className="text-xs text-slate-400">
                Cứ lặp lại đúng 2 bước trên cho đến khi hoàn thành, ta sẽ thu được lời giải hoàn toàn tối ưu mà không cần lưu bất kỳ ngăn xếp đệ quy nào!
              </p>
            </div>
          )}

          {activeTab === "binary" && (
            <div className="instrument-panel p-5 space-y-3.5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="text-signal-green" size={17} />
                Phương pháp Nhị phân & Mã Gray (Binary / Bitwise)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Trò chơi Tháp Hà Nội có mối liên hệ mật thiết với dãy số nhị phân và mã Gray. Nếu ta đếm từ <code className="font-mono text-copper-300">1 đến 2ⁿ - 1</code>:
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4 space-y-2 text-xs text-slate-300 font-mono">
                <div>Bước 1 = 001₂ → Bit 1 ở vị trí 1 → Di chuyển Đĩa 1</div>
                <div>Bước 2 = 010₂ → Bit 1 ở vị trí 2 → Di chuyển Đĩa 2</div>
                <div>Bước 3 = 011₂ → Bit 1 ở vị trí 1 → Di chuyển Đĩa 1</div>
                <div>Bước 4 = 100₂ → Bit 1 ở vị trí 3 → Di chuyển Đĩa 3</div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ở bất kỳ bước thứ <code className="font-mono text-copper-300">k</code> nào, chiếc đĩa cần di chuyển chính là số lượng số 0 tận cùng của k cộng thêm 1: <code className="font-mono text-signal-green">ctz(k) + 1</code>. Phép toán này có thể tính trong <strong className="text-white">O(1)</strong> chu kỳ CPU bằng lệnh vi xử lý!
              </p>
            </div>
          )}
        </div>

        {/* Math & Complexity Column */}
        <div className="space-y-4">
          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calculator className="text-copper-400" size={16} />
              Phương Trình Truy Hồi Toán Học
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gọi <code className="font-mono text-copper-300">T(n)</code> là số bước tối thiểu để giải bài toán với n đĩa:
            </p>
            <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-center border border-white/[0.06] text-copper-300 space-y-1">
              <div>T(1) = 1</div>
              <div>T(n) = 2 · T(n - 1) + 1</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Khai triển cấp số nhân:</p>
            <div className="text-xs font-mono text-slate-300 pl-2 border-l border-white/[0.1] space-y-0.5">
              <div>T(n) = 2(2T(n-2) + 1) + 1</div>
              <div>T(n) = 2ⁿ⁻¹ + ... + 2¹ + 2⁰</div>
              <div className="text-signal-green font-bold pt-1 text-sm">T(n) = 2ⁿ - 1</div>
            </div>
          </div>

          <div className="instrument-panel p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="text-signal-green" size={16} />
              Độ Phức Tạp So Sánh
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Thời gian (Time):</span>
                <span className="text-signal-green font-semibold">O(2ⁿ)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Bộ nhớ đệ quy:</span>
                <span className="text-copper-300 font-semibold">O(n)</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-slate-400">Bộ nhớ vòng lặp:</span>
                <span className="text-signal-blue font-semibold">O(1)</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-300">N = {currentDisks} đĩa:</span>
                <span className="text-white font-bold">{minMoves} bước</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
