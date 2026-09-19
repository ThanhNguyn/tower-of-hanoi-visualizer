export type Locale = "vi" | "en";

export interface TranslationDictionary {
  // Brand & Header
  appTitle: string;
  appSubtitle: string;
  rulesAndGuide: string;
  rulesAndGuideTitle: string;
  soundMute: string;
  soundUnmute: string;
  reset: string;
  resetTitle: string;
  language: string;

  // Global Shortcuts Bar
  disks: string;
  chooseDisks: string;
  shortcutsLabel: string;
  shortcutAutoSolve: string;
  shortcutStep: string;
  shortcutReset: string;
  shortcutUndo: string;

  // Board & Pegs
  pegA: string;
  pegB: string;
  pegC: string;
  roleSource: string;
  roleAuxiliary: string;
  roleTarget: string;
  diskSingular: string;
  diskPlural: string;
  diskTooltip: string;
  topDisk: string;

  // Controls Deck
  hint: string;
  hintTitle: string;
  undo: string;
  undoTitle: string;
  autoSolve: string;
  pause: string;
  autoSolveTitle: string;
  pauseTitle: string;
  firstStep: string;
  prevStep: string;
  nextStep: string;
  lastStep: string;
  speed: string;
  algoRecursive: string;
  algoIterative: string;
  algoBinary: string;
  algoRecursiveDesc: string;
  algoIterativeDesc: string;
  algoBinaryDesc: string;

  // Status prompt & notifications
  statusSolved: string;
  statusSelected: string;
  statusIdle: string;
  invalidMoveLargerOnSmaller: string;
  invalidMoveEmptyRod: string;
  hintPrefix: string;
  puzzleAlreadySolved: string;
  movedDiskFromTo: string;

  // Live Statistics
  liveState: string;
  stateSolved: string;
  stateSimulating: string;
  stateManual: string;
  statTotalDisks: string;
  statMovesMade: string;
  statOptimalMin: string;
  statEfficiency: string;
  statOptimalPath: string;
  statExtraMoves: string;
  statElapsedTimer: string;
  statProgress: string;

  // Completion Panel
  puzzleSolvedTitle: string;
  puzzleSolvedDescOptimal: string;
  puzzleSolvedDescExtra: string;
  replay: string;

  // Call Stack
  callStackTitle: string;
  depth: string;
  stackEmpty: string;
  callStackExplanation: string;

  // Recursive Visualizer
  traceTreeTitle: string;
  disksCount: string;
  currentExecutionFrame: string;
  idle: string;
  noActiveFrame: string;
  depthLabel: string;
  moveNumber: string;
  traceDefaultPrompt: string;
  branchingModelTitle: string;
  step1Left: string;
  step1LeftDesc: string;
  step2Mid: string;
  step2MidDesc: string;
  step3Right: string;
  step3RightDesc: string;

  // Move Ledger
  moveLedgerTitle: string;
  noMovesRecorded: string;
  diskLabel: string;
  jumpToStep: string;
  ledgerHelpText: string;

  // Algorithm Deep-Dive Section
  deepDiveTitle: string;
  tabRecursive: string;
  tabIterative: string;
  tabBinary: string;

  // Deep-Dive Recursive
  baseCaseTitle: string;
  baseCaseDesc: string;
  recursiveCaseTitle: string;
  recursiveCaseDesc: string;
  step1Divide: string;
  step2Base: string;
  step3Conquer: string;

  // Deep-Dive Iterative
  iterativeTitle: string;
  iterativeDesc: string;
  iterativePatternTitle: string;
  iterativeOddStep: string;
  iterativeEvenStep: string;
  iterativeConclusion: string;

  // Deep-Dive Binary
  binaryTitle: string;
  binaryDesc: string;
  binaryExplanation: string;

  // Deep-Dive Math
  mathRecurrenceTitle: string;
  mathRecurrenceIntro: string;
  mathUnrolling: string;
  complexityTitle: string;
  timeComplexity: string;
  recursiveSpace: string;
  iterativeSpace: string;
  movesForNDisks: string;

  // Rules Modal
  modalTitle: string;
  tabGameRules: string;
  tabSolvingParadigms: string;
  tabLegend: string;
  objectiveTitle: string;
  objectiveDesc: string;
  canonicalRulesTitle: string;
  rule1Title: string;
  rule1Desc: string;
  rule2Title: string;
  rule2Desc: string;
  rule3Title: string;
  rule3Desc: string;
  minimalOptimalMovesLabel: string;
  minimalOptimalMovesDesc: string;
  modalCloseButton: string;

  // Modal Paradigms Tab
  paradigmRecursiveTitle: string;
  paradigmRecursiveDesc: string;
  paradigmIterativeTitle: string;
  paradigmIterativeDesc: string;
  paradigmBinaryTitle: string;
  paradigmBinaryDesc: string;

  // Modal Legend Tab
  legendTitle: string;
  legendP1: string;
  legendP2: string;
  legendTotalMoves: string;
  legendTimeRequired: string;
}

export const translations: Record<Locale, TranslationDictionary> = {
  vi: {
    // Brand & Header
    appTitle: "Tháp Hà Nội",
    appSubtitle: "Mô phỏng đệ quy & trực quan thuật toán · Chia để trị, Máy trạng thái, Mã Gray",
    rulesAndGuide: "Luật chơi & Hướng dẫn",
    rulesAndGuideTitle: "Xem luật chơi, chứng minh toán học và truyền thuyết Tháp Hà Nội",
    soundMute: "Tắt âm thanh",
    soundUnmute: "Bật âm thanh",
    reset: "Đặt lại",
    resetTitle: "Đặt lại bàn cờ về vị trí ban đầu (Phím R)",
    language: "Ngôn ngữ",

    // Global Shortcuts Bar
    disks: "Số đĩa:",
    chooseDisks: "Chọn số lượng đĩa",
    shortcutsLabel: "Phím tắt:",
    shortcutAutoSolve: "Tự động giải",
    shortcutStep: "Từng bước",
    shortcutReset: "Đặt lại",
    shortcutUndo: "Hoàn tác",

    // Board & Pegs
    pegA: "Cọc A",
    pegB: "Cọc B",
    pegC: "Cọc C",
    roleSource: "Nguồn",
    roleAuxiliary: "Trung gian",
    roleTarget: "Đích",
    diskSingular: "đĩa",
    diskPlural: "đĩa",
    diskTooltip: "Đĩa",
    topDisk: "(Đĩa trên cùng)",

    // Controls Deck
    hint: "Gợi ý",
    hintTitle: "Gợi ý nước đi tối ưu tiếp theo",
    undo: "Hoàn tác",
    undoTitle: "Hoàn tác nước đi vừa rồi (Ctrl+Z)",
    autoSolve: "Tự động giải",
    pause: "Tạm dừng",
    autoSolveTitle: "Tự động giải (Phím Space)",
    pauseTitle: "Tạm dừng (Phím Space)",
    firstStep: "Về bước đầu",
    prevStep: "Bước trước (←)",
    nextStep: "Bước tiếp (→)",
    lastStep: "Đến bước cuối",
    speed: "Tốc độ:",
    algoRecursive: "Đệ quy",
    algoIterative: "Lặp",
    algoBinary: "Mã Gray",
    algoRecursiveDesc: "Chia để trị O(2ⁿ), ngăn xếp đệ quy O(N)",
    algoIterativeDesc: "Máy trạng thái modulo luân phiên, bộ nhớ O(1)",
    algoBinaryDesc: "Mã Gray & đếm số bit 0 liên tiếp (ctz)",

    // Status prompt & notifications
    statusSolved: "🎉 Đã hoàn thành trò chơi! Bấm Đặt lại để chơi lại.",
    statusSelected: "Đã chọn Cọc {rod}. Hãy nhấp chọn cọc đích đến.",
    statusIdle: "Nhấp vào cọc để di chuyển hoặc bấm Tự động giải.",
    invalidMoveLargerOnSmaller: "Nước đi không hợp lệ: Đĩa {diskToMove} lớn hơn đĩa {topDestDisk}. Không được đặt đĩa to lên đĩa nhỏ.",
    invalidMoveEmptyRod: "Cọc nguồn không có đĩa nào để di chuyển.",
    hintPrefix: "Gợi ý:",
    puzzleAlreadySolved: "Trò chơi đã hoàn thành!",
    movedDiskFromTo: "Đã chuyển Đĩa {disk} từ Cọc {from} sang Cọc {to}.",

    // Live Statistics
    liveState: "Trạng thái",
    stateSolved: "Đã giải xong!",
    stateSimulating: "Đang tự động mô phỏng ({algo})",
    stateManual: "Người chơi tự di chuyển",
    statTotalDisks: "Tổng số đĩa",
    statMovesMade: "Số bước đã đi",
    statOptimalMin: "Tối ưu nhỏ nhất",
    statEfficiency: "Hiệu quả bước đi",
    statOptimalPath: "Đường đi tối ưu tuyệt đối",
    statExtraMoves: "+{count} bước thừa",
    statElapsedTimer: "Thời gian đã chơi",
    statProgress: "Tiến độ hoàn thành",

    // Completion Panel
    puzzleSolvedTitle: "Chúc mừng! Đã giải xong câu đố",
    puzzleSolvedDescOptimal: "{moves} bước · số bước tối thiểu {minMoves} · giải pháp tối ưu tuyệt đối",
    puzzleSolvedDescExtra: "{moves} bước · số bước tối thiểu {minMoves} · nhiều hơn tối ưu {extra} bước",
    replay: "Chơi lại",

    // Call Stack
    callStackTitle: "Ngăn xếp đệ quy (Call Stack)",
    depth: "Độ sâu:",
    stackEmpty: "Ngăn xếp trống (Mô phỏng sẵn sàng hoặc đã hoàn tất)",
    callStackExplanation: "Mỗi lần gọi đệ quy sẽ đẩy (push) một khung tham số (n, nguồn, phụ, đích). Khi bước cơ sở hoàn tất, khung sẽ được lấy ra (pop).",

    // Recursive Visualizer
    traceTreeTitle: "Cây & Dấu vết đệ quy",
    disksCount: "{count} Đĩa",
    currentExecutionFrame: "Khung thực thi hiện tại",
    idle: "Nghỉ",
    noActiveFrame: "Không có khung nào hoạt động",
    depthLabel: "Độ sâu {depth}",
    moveNumber: "Bước #{moveIndex}: Đĩa {disk} ({from} → {to})",
    traceDefaultPrompt: "Bắt đầu mô phỏng tự động để theo dõi quá trình phân rã đệ quy theo thời gian thực.",
    branchingModelTitle: "Mô hình Phân nhánh Đệ quy",
    step1Left: "Bước 1 (Trái)",
    step1LeftDesc: "Chuyển n-1 sang Cọc phụ",
    step2Mid: "Bước 2 (Gốc/Giữa)",
    step2MidDesc: "Chuyển đĩa lớn nhất sang Đích",
    step3Right: "Bước 3 (Phải)",
    step3RightDesc: "Chuyển n-1 sang Đích",

    // Move Ledger
    moveLedgerTitle: "Nhật ký nước đi",
    noMovesRecorded: "Chưa có nước đi nào được ghi nhận",
    diskLabel: "Đĩa {disk}",
    jumpToStep: "Chuyển đến bước {step}",
    ledgerHelpText: "Nhấp vào bất kỳ dòng nào để chuyển trạng thái bàn cờ đến bước đó.",

    // Algorithm Deep-Dive Section
    deepDiveTitle: "Tìm hiểu sâu về các Phương pháp Giải thuật",
    tabRecursive: "1. Đệ quy (Chia để trị)",
    tabIterative: "2. Thuật toán Lặp (Máy trạng thái)",
    tabBinary: "3. Nhị phân (Mã Gray)",

    // Deep-Dive Recursive
    baseCaseTitle: "Trường hợp Cơ sở (Base Case: n = 1)",
    baseCaseDesc: "Khi chỉ có duy nhất 1 đĩa, không có đĩa nào khác cản trở. Ta có thể chuyển trực tiếp từ cọc Nguồn sang cọc Đích mà không cần dùng cọc trung gian.",
    recursiveCaseTitle: "Trường hợp Đệ quy (Recursive Case: n > 1)",
    recursiveCaseDesc: "Để chuyển N đĩa từ cọc Nguồn sang cọc Đích tuân thủ đúng luật, bài toán được phân rã thành 3 bài toán con nối tiếp nhau:",
    step1Divide: "Bước 1: Chuyển đệ quy N - 1 đĩa phía trên từ cọc Nguồn sang cọc Phụ (dùng cọc Đích làm cọc đệm).",
    step2Base: "Bước 2: Chuyển trực tiếp đĩa lớn nhất N từ cọc Nguồn sang cọc Đích.",
    step3Conquer: "Bước 3: Chuyển đệ quy N - 1 đĩa từ cọc Phụ sang cọc Đích (dùng cọc Nguồn làm cọc đệm).",

    // Deep-Dive Iterative
    iterativeTitle: "Thuật toán Lặp không dùng ngăn xếp (Máy trạng thái)",
    iterativeDesc: "Với số đĩa lớn, ngăn xếp đệ quy sâu có nguy cơ tràn bộ nhớ (Stack Overflow). Thuật toán lặp giải quyết bài toán chỉ với bộ nhớ phụ O(1) nhờ quy luật chẵn lẻ luân phiên:",
    iterativePatternTitle: "Quy luật 2 bước luân phiên:",
    iterativeOddStep: "Lượt lẻ (1, 3, 5,...): Luôn di chuyển Đĩa 1 (đĩa nhỏ nhất) sang cọc kế tiếp theo chu trình cố định:",
    iterativeEvenStep: "Lượt chẵn (2, 4, 6,...): Luôn chỉ có DUY NHẤT một nước đi hợp lệ giữa hai cọc không chứa Đĩa 1 (đặt đĩa nhỏ hơn lên đĩa lớn hơn).",
    iterativeConclusion: "Lặp lại hai quy tắc tất định này sẽ mang lại đúng chuỗi nước đi tối ưu tối thiểu mà không cần duy trì call stack!",

    // Deep-Dive Binary
    binaryTitle: "Mã Gray Nhị phân & Đếm Bit phần cứng",
    binaryDesc: "Bài toán Tháp Hà Nội đẳng cấu với phép đếm nhị phân và mã Gray đối xứng. Đếm từ 1 đến 2ⁿ - 1 dưới dạng nhị phân:",
    binaryExplanation: "Ở mỗi bước k, đĩa cần di chuyển chính là vị trí của bit 1 có trọng số nhỏ nhất (Trailing Zeros): ctz(k) + 1. Thao tác này được tính toán trong O(1) chỉ với 1 lệnh CPU phần cứng!",

    // Deep-Dive Math
    mathRecurrenceTitle: "Hệ thức Truy hồi Toán học",
    mathRecurrenceIntro: "Gọi T(n) là số bước di chuyển tối thiểu để giải bài toán với n đĩa:",
    mathUnrolling: "Khai triển chuỗi cấp số nhân:",
    complexityTitle: "So sánh Độ phức tạp",
    timeComplexity: "Độ phức tạp thời gian:",
    recursiveSpace: "Bộ nhớ phụ (Đệ quy):",
    iterativeSpace: "Bộ nhớ phụ (Thuật toán lặp):",
    movesForNDisks: "Với N = {count} đĩa:",

    // Rules Modal
    modalTitle: "Luật chơi & Hướng dẫn Tháp Hà Nội",
    tabGameRules: "Luật chơi",
    tabSolvingParadigms: "Các giải thuật",
    tabLegend: "Truyền thuyết Tháp Brahma",
    objectiveTitle: "Mục tiêu trò chơi",
    objectiveDesc: "Di chuyển toàn bộ N đĩa từ Cọc A (Nguồn) sang Cọc C (Đích), sử dụng Cọc B (Trung gian) làm cọc đệm.",
    canonicalRulesTitle: "3 Quy tắc Bất biến",
    rule1Title: "Quy tắc 1: Mỗi lần chỉ được chuyển 1 đĩa",
    rule1Desc: "Trong mỗi lượt đi, người chơi chỉ được phép nhấc và di chuyển duy nhất một chiếc đĩa.",
    rule2Title: "Quy tắc 2: Chỉ được nhấc chiếc đĩa trên cùng",
    rule2Desc: "Không thể rút đĩa ở giữa hoặc đáy cọc; chỉ có chiếc đĩa nằm trên cùng của mỗi cọc mới có thể di chuyển.",
    rule3Title: "Quy tắc 3: Tuyệt đối không đặt đĩa lớn lên đĩa nhỏ",
    rule3Desc: "Một chiếc đĩa chỉ có thể đặt vào một cọc đang trống hoặc đặt lên trên một chiếc đĩa có kích thước lớn hơn nó.",
    minimalOptimalMovesLabel: "Số bước tối thiểu:",
    minimalOptimalMovesDesc: "Để giải bài toán Tháp Hà Nội với N đĩa luôn cần chính xác {formula} bước.",
    modalCloseButton: "Đã hiểu, bắt đầu chơi!",

    // Modal Paradigms Tab
    paradigmRecursiveTitle: "1. Thuật toán Đệ quy (Chia để trị)",
    paradigmRecursiveDesc: "Phân rã bài toán: (1) Chuyển n-1 đĩa sang cọc phụ; (2) Chuyển đĩa n sang cọc đích; (3) Chuyển n-1 đĩa từ cọc phụ sang cọc đích. Mã nguồn thanh lịch, độ sâu ngăn xếp O(N).",
    paradigmIterativeTitle: "2. Thuật toán Lặp (Chiến lược Luân phiên)",
    paradigmIterativeDesc: "Không cần ngăn xếp: Ở lượt lẻ, chuyển Đĩa 1 tuần hoàn. Ở lượt chẵn, thực hiện nước đi hợp lệ duy nhất giữa 2 cọc còn lại. Tiết kiệm bộ nhớ tối đa O(1).",
    paradigmBinaryTitle: "3. Nhị phân & Mã Gray (Đếm Bit)",
    paradigmBinaryDesc: "Đếm từ 1 đến 2ⁿ - 1 theo hệ nhị phân. Tại bước k, số đĩa cần chuyển xác định bởi bit 1 đầu tiên từ phải sang trái (ctz(k)+1). Thể hiện mối liên hệ tuyệt đẹp với tam giác Sierpiński!",

    // Modal Legend Tab
    legendTitle: "Truyền thuyết Ngôi đền Brahma tại Ấn Độ",
    legendP1: "Theo truyền thuyết cổ xưa tại ngôi đền Kashi Vishwanath (Varanasi), các nhà sư Bà La Môn được thần Brahma trao cho 64 chiếc đĩa bằng vàng ròng để chuyển qua lại giữa 3 cây kim bằng kim cương tuân thủ nghiêm ngặt các quy tắc trên.",
    legendP2: "Lời sấm truyền rằng khi chiếc đĩa vàng thứ 64 cuối cùng được đặt chuẩn xác sang cây kim đích, ngôi đền sẽ sụp đổ thành cát bụi và vũ trụ sẽ đi đến hồi kết thúc.",
    legendTotalMoves: "Tổng số bước đi = 2⁶⁴ - 1 = 18.446.744.073.709.551.615 bước.",
    legendTimeRequired: "Nếu mỗi giây di chuyển được 1 đĩa không ngừng nghỉ, cần khoảng 584,9 tỷ năm để hoàn thành (gấp 42 lần tuổi thọ hiện tại của vũ trụ)!"
  },
  en: {
    // Brand & Header
    appTitle: "Tower of Hanoi",
    appSubtitle: "Interactive Recursion & Algorithm Visualizer · Divide & Conquer, State Machine, Gray Code",
    rulesAndGuide: "Rules & Guide",
    rulesAndGuideTitle: "View game rules, mathematical proof, and the legend of Hanoi",
    soundMute: "Mute audio",
    soundUnmute: "Unmute audio",
    reset: "Reset",
    resetTitle: "Reset board to starting configuration (R)",
    language: "Language",

    // Global Shortcuts Bar
    disks: "Disks:",
    chooseDisks: "Choose number of disks",
    shortcutsLabel: "Shortcuts:",
    shortcutAutoSolve: "Auto-Solve",
    shortcutStep: "Step",
    shortcutReset: "Reset",
    shortcutUndo: "Undo",

    // Board & Pegs
    pegA: "Peg A",
    pegB: "Peg B",
    pegC: "Peg C",
    roleSource: "Source",
    roleAuxiliary: "Auxiliary",
    roleTarget: "Target",
    diskSingular: "disk",
    diskPlural: "disks",
    diskTooltip: "Disk",
    topDisk: "(Top disk)",

    // Controls Deck
    hint: "Hint",
    hintTitle: "Highlight the next optimal move",
    undo: "Undo",
    undoTitle: "Undo last move (Ctrl+Z)",
    autoSolve: "Auto Solve",
    pause: "Pause",
    autoSolveTitle: "Auto Solve (Space)",
    pauseTitle: "Pause (Space)",
    firstStep: "First step",
    prevStep: "Previous step (←)",
    nextStep: "Next step (→)",
    lastStep: "Last step",
    speed: "Speed:",
    algoRecursive: "Recursive",
    algoIterative: "Iterative",
    algoBinary: "Binary (Gray)",
    algoRecursiveDesc: "Divide & Conquer O(2ⁿ), O(N) Call Stack",
    algoIterativeDesc: "Modulo State Machine O(1) Space",
    algoBinaryDesc: "Gray Code & Bitwise Trailing Zeros",

    // Status prompt & notifications
    statusSolved: "🎉 Puzzle completed! Reset to play again.",
    statusSelected: "Peg {rod} selected. Choose destination peg.",
    statusIdle: "Click a peg to move, or hit Auto Solve.",
    invalidMoveLargerOnSmaller: "Invalid move: Disk {diskToMove} is larger than Disk {topDestDisk}. Larger disks cannot be placed on smaller disks.",
    invalidMoveEmptyRod: "Source rod has no disks to move.",
    hintPrefix: "Hint:",
    puzzleAlreadySolved: "Puzzle has already been solved!",
    movedDiskFromTo: "Moved Disk {disk} from Rod {from} to Rod {to}.",

    // Live Statistics
    liveState: "Live State",
    stateSolved: "Solved",
    stateSimulating: "Auto-simulating ({algo})",
    stateManual: "Manual interactive play",
    statTotalDisks: "Total disks",
    statMovesMade: "Moves made",
    statOptimalMin: "Optimal minimal",
    statEfficiency: "Move efficiency",
    statOptimalPath: "Optimal path",
    statExtraMoves: "+{count} extra moves",
    statElapsedTimer: "Elapsed timer",
    statProgress: "Completion Progress",

    // Completion Panel
    puzzleSolvedTitle: "Puzzle solved",
    puzzleSolvedDescOptimal: "{moves} moves · minimum possible {minMoves} · optimal solution",
    puzzleSolvedDescExtra: "{moves} moves · minimum possible {minMoves} · {extra} above optimal",
    replay: "Replay",

    // Call Stack
    callStackTitle: "Call Stack",
    depth: "Depth:",
    stackEmpty: "Stack is empty (Simulation ready or completed)",
    callStackExplanation: "Each call pushes a frame with parameters (n, src, aux, dst). Returns pop the frame when base case moves complete.",

    // Recursive Visualizer
    traceTreeTitle: "Recursive Trace & Tree",
    disksCount: "N = {count} Disks",
    currentExecutionFrame: "Current Execution Frame",
    idle: "Idle",
    noActiveFrame: "No active frame",
    depthLabel: "Depth {depth}",
    moveNumber: "Move #{moveIndex}: Disk {disk} ({from} → {to})",
    traceDefaultPrompt: "Start the solver to trace the recursive decomposition in real-time.",
    branchingModelTitle: "Recursive Branching Model",
    step1Left: "Step 1 (Left)",
    step1LeftDesc: "Move n-1 to Aux",
    step2Mid: "Step 2 (Base/Mid)",
    step2MidDesc: "Move largest to Goal",
    step3Right: "Step 3 (Right)",
    step3RightDesc: "Move n-1 to Goal",

    // Move Ledger
    moveLedgerTitle: "Move Ledger",
    noMovesRecorded: "No moves recorded yet",
    diskLabel: "Disk {disk}",
    jumpToStep: "Jump to step {step}",
    ledgerHelpText: "Click any move row to jump the visualizer directly to that step.",

    // Algorithm Deep-Dive Section
    deepDiveTitle: "Deep-Dive into Algorithm Paradigms",
    tabRecursive: "1. Recursive (Divide & Conquer)",
    tabIterative: "2. Iterative (State Machine)",
    tabBinary: "3. Binary (Gray Code)",

    // Deep-Dive Recursive
    baseCaseTitle: "Base Case (n = 1)",
    baseCaseDesc: "When there is only 1 disk, no other disks obstruct it. It can immediately be moved directly from Source to Target without needing any intermediate auxiliary buffer.",
    recursiveCaseTitle: "Recursive Case (n > 1)",
    recursiveCaseDesc: "To move N disks from Source to Target according to the rules, the problem decomposes into 3 sequential sub-problems:",
    step1Divide: "Step 1: Recursively move top N - 1 disks from Source to Auxiliary (using Target as buffer).",
    step2Base: "Step 2: Move largest disk N directly from Source to Target.",
    step3Conquer: "Step 3: Recursively move N - 1 disks from Auxiliary to Target (using Source as buffer).",

    // Deep-Dive Iterative
    iterativeTitle: "Stackless Iterative Algorithm (State Machine)",
    iterativeDesc: "For large disk counts, recursive depth risks stack overflow. The iterative approach solves Tower of Hanoi with O(1) auxiliary space via alternating parity:",
    iterativePatternTitle: "Alternating 2-Step Pattern:",
    iterativeOddStep: "Odd Turns (1, 3, 5, ...): Always cycle Disk 1 (smallest) to the next rod along its fixed rotational cycle:",
    iterativeEvenStep: "Even Turns (2, 4, 6, ...): There is always exactly ONE legal move between the two rods that do not contain Disk 1 (place the smaller disk onto the larger disk).",
    iterativeConclusion: "Repeating these two deterministic rules yields the exact minimal optimal solution without maintaining any call stack!",

    // Deep-Dive Binary
    binaryTitle: "Binary Gray Code & Bitwise Counters",
    binaryDesc: "The Tower of Hanoi is isomorphic to binary counting and reflected binary Gray codes. Counting from 1 to 2ⁿ - 1 in binary:",
    binaryExplanation: "At any step k, the disk to move is determined by the lowest 1-bit index: ctz(k) + 1. This can be computed in O(1) hardware instructions!",

    // Deep-Dive Math
    mathRecurrenceTitle: "Mathematical Recurrence",
    mathRecurrenceIntro: "Let T(n) be the minimal number of moves required for n disks:",
    mathUnrolling: "Unrolling the geometric series:",
    complexityTitle: "Complexity Comparison",
    timeComplexity: "Time Complexity:",
    recursiveSpace: "Recursive Space:",
    iterativeSpace: "Iterative Space:",
    movesForNDisks: "N = {count} disks:",

    // Rules Modal
    modalTitle: "Tower of Hanoi Rules & Guide",
    tabGameRules: "Game Rules",
    tabSolvingParadigms: "Solving Paradigms",
    tabLegend: "Legend of Brahma",
    objectiveTitle: "Objective",
    objectiveDesc: "Transfer all N disks from Rod A (Source) to Rod C (Target), using Rod B (Auxiliary) as intermediate buffer.",
    canonicalRulesTitle: "The 3 Canonical Rules",
    rule1Title: "Rule 1: Only one disk moved at a time",
    rule1Desc: "You may only move a single disk during each turn.",
    rule2Title: "Rule 2: Only the top disk can be moved",
    rule2Desc: "Disks cannot be extracted from beneath other disks; only the topmost disk of any rod is movable.",
    rule3Title: "Rule 3: No larger disk on smaller disk",
    rule3Desc: "A disk may only be placed either onto an empty rod or on top of a larger disk.",
    minimalOptimalMovesLabel: "Minimal Optimal Moves:",
    minimalOptimalMovesDesc: "Solving Tower of Hanoi with N disks always requires exactly {formula} moves.",
    modalCloseButton: "Got it, let's play!",

    // Modal Paradigms Tab
    paradigmRecursiveTitle: "1. Recursive Algorithm (Divide & Conquer)",
    paradigmRecursiveDesc: "Decomposes problem into: (1) Move top N-1 disks to Auxiliary; (2) Move largest disk N directly to Target; (3) Move N-1 disks from Auxiliary to Target. Elegant, requiring O(N) call stack space.",
    paradigmIterativeTitle: "2. Iterative Algorithm (Alternating Strategy)",
    paradigmIterativeDesc: "Stackless execution: On odd turns, cycle smallest Disk 1 (A → B → C if N even, or A → C → B if N odd). On even turns, make the single legal move possible between the two remaining rods. Requires O(1) space!",
    paradigmBinaryTitle: "3. Binary & Gray Code (Bitwise Counter)",
    paradigmBinaryDesc: "Count from 1 to 2ⁿ - 1 in binary. At step k, the disk to move is determined by the lowest 1-bit (ctz(k) + 1). This establishes an isomorphism between the Tower of Hanoi, Gray codes, and the Sierpiński triangle!",

    // Modal Legend Tab
    legendTitle: "The Legend of Brahma's Temple",
    legendP1: "According to ancient legend, in a temple at Kashi Vishwanath (Varanasi), Hindu priests were assigned by Brahma to transfer 64 sacred golden disks across three diamond needles according to the immutable rules.",
    legendP2: "Prophecy holds that when the 64th golden disk is placed on the destination needle, the temple will crumble into dust and the universe will reach its end.",
    legendTotalMoves: "Total moves = 2⁶⁴ - 1 = 18,446,744,073,709,551,615 steps.",
    legendTimeRequired: "At 1 move per second nonstop, completing it requires approximately 584.9 billion years (42× the age of our universe)!"
  }
};
