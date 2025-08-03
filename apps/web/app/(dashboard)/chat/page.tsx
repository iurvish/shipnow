import AI_Input_Search from "@/components/shared/ai-input-search";

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
      <div className=" p-4">
        <div className="max-w-4xl mx-auto">
          <AI_Input_Search />
        </div>
      </div>
    </div>
  );
}
