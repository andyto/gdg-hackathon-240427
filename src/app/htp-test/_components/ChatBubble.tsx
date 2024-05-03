import { cn } from "@/lib/utils";

const ChatBubble = ({
  isSelf,
  message,
  receivedAt = new Date(),
}: {
  isSelf: boolean;
  message: React.ReactNode;
  receivedAt: Date;
}) => {
  return (
    <div
      className={cn("flex", {
        "flex-row-reverse": isSelf,
      })}
    >
      <div
        className={cn("rounded-full w-6 h-6", {
          "ml-2": isSelf,
          "mr-2": !isSelf,
          "bg-green-200": isSelf,
          "bg-yellow-200": !isSelf,
        })}
      ></div>
      <div
        className={cn("rounded p-4 w-[70%]", {
          "bg-green-100": isSelf,
          "bg-yellow-100": !isSelf,
        })}
      >
        <div className="font-bold">{isSelf ? "You" : "Counsellor Bot"}</div>
        <div className="mt-2 overflow-hidden">{message}</div>
        <div className={cn("mt-2 text-right")}>
          {receivedAt.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
