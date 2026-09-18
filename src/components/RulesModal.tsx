import { useState } from "react";
import { BookOpen, CheckCircle, Lightbulb, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "vi" | "en";
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  const [activeTab, setActiveTab] = useState<"rules" | "algorithms" | "legend">("rules");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/[0.12] bg-[#0f1722] shadow-2xl overflow-hidden z-10"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 bg-ink-900/80">
            <div className="flex items-center gap-2.5">
              <BookOpen className="text-copper-400" size={20} />
              <h2 className="text-base font-semibold text-white">
                Hướng Dẫn & Luật Chơi Tháp Hà Nội
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/[0.06] hover:text-white transition"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/[0.06] px-5 bg-black/20 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("rules")}
              className={`py-3 px-3 border-b-2 transition ${
                activeTab === "rules"
                  ? "border-copper-400 text-copper-300 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Luật Chơi Cơ Bản
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("algorithms")}
              className={`py-3 px-3 border-b-2 transition ${
                activeTab === "algorithms"
                  ? "border-copper-400 text-copper-300 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              3 Cách Giải Kinh Điển
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("legend")}
              className={`py-3 px-3 border-b-2 transition ${
                activeTab === "legend"
                  ? "border-copper-400 text-copper-300 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Truyền Thuyết 64 Đĩa Vàng
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-5 space-y-4 text-sm text-slate-300">
            {activeTab === "rules" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-copper-400/20 bg-copper-400/10 p-4">
                  <h3 className="font-semibold text-copper-200 flex items-center gap-2 mb-1">
                    <Lightbulb size={16} /> Mục Tiêu Trò Chơi
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Di chuyển toàn bộ <strong className="text-white">N đĩa</strong> từ{" "}
                    <strong className="text-copper-300">Cọc A (Nguồn)</strong> sang{" "}
                    <strong className="text-signal-green">Cọc C (Đích)</strong>, sử dụng{" "}
                    <strong className="text-slate-300">Cọc B (Trung gian)</strong> làm trạm đệm.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    3 Quy Tắc Bất Di Bất Dịch
                  </h4>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <CheckCircle className="text-signal-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-white block mb-0.5">Quy tắc 1: Mỗi lần chỉ chuyển 1 đĩa</strong>
                      <p className="text-xs text-slate-400">
                        Chỉ được nhấc và di chuyển một chiếc đĩa đơn lẻ trong mỗi lượt đi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <CheckCircle className="text-signal-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-white block mb-0.5">Quy tắc 2: Chỉ lấy đĩa trên cùng</strong>
                      <p className="text-xs text-slate-400">
                        Chỉ chiếc đĩa nằm ở vị trí cao nhất của một cọc mới có thể được nhấc ra.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <CheckCircle className="text-signal-green shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-white block mb-0.5">Quy tắc 3: Đĩa lớn không đặt trên đĩa nhỏ</strong>
                      <p className="text-xs text-slate-400">
                        Một chiếc đĩa chỉ có thể đặt vào cọc trống hoặc đặt lên trên một chiếc đĩa LỚN HƠN nó.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3.5 text-xs text-slate-400">
                  <span className="font-mono text-copper-300 font-semibold">Công thức tối ưu:</span>{" "}
                  Số bước ít nhất để hoàn thành trò chơi với N đĩa luôn bằng{" "}
                  <code className="font-mono font-bold text-signal-green">2ⁿ - 1</code> bước.
                </div>
              </div>
            )}

            {activeTab === "algorithms" && (
              <div className="space-y-3.5">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-signal-blue" />
                    1. Phương pháp Đệ quy (Divide & Conquer)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Chia bài toán N đĩa thành: (1) Chuyển N-1 đĩa sang cọc phụ; (2) Chuyển đĩa lớn nhất sang đích; (3) Chuyển N-1 đĩa từ cọc phụ về đích. Cực kỳ thanh lịch, dùng ngăn xếp bộ nhớ O(N).
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-copper-400" />
                    2. Phương pháp Vòng lặp (Bán chu kỳ / Modulo)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Không dùng đệ quy. Luân phiên: Ở bước lẻ di chuyển đĩa nhỏ nhất theo vòng tròn A → B → C (hoặc A → C → B tùy số đĩa chẵn hay lẻ). Ở bước chẵn, chỉ có đúng một nước đi hợp lệ duy nhất giữa 2 cọc còn lại!
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-signal-green" />
                    3. Phương pháp Nhị phân & Mã Gray (Bitwise)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Đếm số từ 1 đến 2ⁿ - 1 dưới dạng nhị phân. Ở bước thứ k, đĩa được di chuyển chính là vị trí của bit 1 thấp nhất (`ctz(k) + 1`). Đây là một trong những ứng dụng toán học kỳ thú nhất của mã Gray!
                  </p>
                </div>
              </div>
            )}

            {activeTab === "legend" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
                  <h4 className="font-semibold text-copper-300 flex items-center gap-2">
                    <Sparkles size={16} /> Truyền Thuyết Đền Benares
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Theo truyền thuyết cổ Ấn Độ, tại ngôi đền thần thánh ở Varanasi (Benares), thần Brahma đã cắm ba chiếc kim kim cương trên một đế đồng và xỏ vào đó <strong className="text-white">64 chiếc đĩa bằng vàng ròng</strong>, xếp từ lớn đến nhỏ.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Các nhà sư ngày đêm chuyển các đĩa theo đúng 3 luật nghiêm ngặt. Lời sấm truyền rằng: khi đĩa vàng thứ 64 được đặt vào cọc đích thành công, ngôi đền sẽ sụp đổ thành cát bụi và ngày tàn của thế giới sẽ bắt đầu.
                  </p>
                  <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-signal-green border border-white/[0.08]">
                    Số bước = 2⁶⁴ - 1 = 18,446,744,073,709,551,615 bước.<br />
                    Nếu mỗi giây chuyển được 1 đĩa không nghỉ, cần khoảng <strong>584.9 tỷ năm</strong> (gấp 42 lần tuổi thọ vũ trụ hiện tại)!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-white/[0.08] px-5 py-3 bg-ink-900/60 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="control-button control-button-primary px-5 py-1.5 text-xs"
            >
              Đã hiểu, bắt đầu chơi!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
