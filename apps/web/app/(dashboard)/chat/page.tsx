export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Welcome Message */}
          <div className="flex justify-center">
            <div className="bg-muted rounded-none p-4 max-w-md text-center">
              <h3 className="font-semibold mb-2">Welcome to Chatbot</h3>
              <p className="text-sm text-muted-foreground">
                Start a conversation by typing a message below.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Input Area */}
      <div className="border-t border-border/40 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                placeholder="Type your message here..."
                className="w-full min-h-[50px] max-h-[200px] p-3 pr-12 border border-border rounded-none resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={1}
              />
              <button className="absolute right-2 bottom-2 p-2 text-muted-foreground hover:text-foreground transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span>0 / 4000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
