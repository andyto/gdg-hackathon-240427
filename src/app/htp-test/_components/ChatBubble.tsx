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
        className={cn("rounded-full bg-green-200 w-8 h-8", {
          "ml-2": isSelf,
          "mr-2": !isSelf,
        })}
      ></div>
      <div className={cn("rounded p-4 bg-gray-200 w-[70%]", {})}>
        <div>{isSelf ? "You" : "Bot"}</div>
        <div>{message}</div>
        <div className={cn("mt-2 text-right")}>
          {receivedAt.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
