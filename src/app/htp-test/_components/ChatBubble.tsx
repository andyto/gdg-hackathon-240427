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
        className={cn("rounded-full w-8 h-8", {
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
