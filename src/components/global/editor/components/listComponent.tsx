import { cn } from "@/lib/utils";
import React from "react";

type ListProps = {
  items: string[];
  className?: string;
  isEditable?: boolean;
  onChange: (items: string[]) => void;
};

type ListItemProps = {
  item: string;
  index: number;
  isEditable: boolean;
  onChange: (index: number, value: string) => void;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void;
};

const ListItem: React.FC<ListItemProps> = ({
  item,
  index,
  isEditable,
  onChange,
  onKeyDown,
}) => (
  <input
    type="text"
    value={item}
    onChange={(e) => onChange(index, e.target.value)}
    onKeyDown={(e) => onKeyDown(e, index)}
    className="w-full bg-transparent py-1 text-[color:var(--slide-fg)] outline-none"
    readOnly={!isEditable}
  />
);

const useListKeyHandler = (
  items: string[],
  onChange: (items: string[]) => void,
  isEditable: boolean
) => {
  const handleChange = (index: number, value: string) => {
    if (!isEditable) return;
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newItems = [...items];
      newItems.splice(index + 1, 0, "");
      onChange(newItems);
      setTimeout(() => {
        const nextInput = document.querySelector(
          `li:nth-child(${index + 2}) input`
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }, 0);
    } else if (
      event.key === "Backspace" &&
      items[index] === "" &&
      items.length > 1
    ) {
      event.preventDefault();
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange(newItems);
    }
  };

  return { handleChange, handleKeyDown };
};

const NumberedList: React.FC<ListProps> = ({
  items,
  className,
  isEditable = true,
  onChange,
}) => {
  const { handleChange, handleKeyDown } = useListKeyHandler(items, onChange, isEditable);

  return (
    <ol
      className={cn(
        "list-inside list-decimal space-y-[var(--slide-space-1)] text-[color:var(--slide-fg)] marker:text-[color:var(--slide-accent)]",
        className
      )}
    >
      {items.map((item, index) => (
        <li key={index}>
          <ListItem
            item={item}
            index={index}
            isEditable={isEditable}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </li>
      ))}
    </ol>
  );
};

export const BulletList: React.FC<ListProps> = ({
  className,
  items,
  isEditable = true,
  onChange,
}) => {
  const { handleChange, handleKeyDown } = useListKeyHandler(items, onChange, isEditable);

  return (
    <ul
      className={cn(
        "list-disc space-y-[var(--slide-space-1)] pl-5 text-[color:var(--slide-fg)] marker:text-[color:var(--slide-accent)]",
        className
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="pl-1">
          <ListItem
            item={item}
            index={index}
            isEditable={isEditable}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </li>
      ))}
    </ul>
  );
};

export const TodoList: React.FC<ListProps> = ({
  items,
  className,
  isEditable = true,
  onChange,
}) => {
  const toggleCheckBox = (index: number) => {
    if (!isEditable) return;
    const newItems = [...items];
    newItems[index] = newItems[index].startsWith("[x] ")
      ? newItems[index].replace("[x] ", "[ ] ")
      : newItems[index].replace("[ ] ", "[x] ");
    onChange(newItems);
  };

  const handleChange = (index: number, value: string) => {
    if (!isEditable) return;
    const newItems = [...items];
    newItems[index] =
      value.startsWith("[ ] ") || value.startsWith("[x] ")
        ? value
        : `[ ] ${value}`;
    onChange(newItems);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newItems = [...items];
      newItems.splice(index + 1, 0, "");
      onChange(newItems);
      setTimeout(() => {
        const nextInput = document.querySelector(
          `li:nth-child(${index + 2}) input`
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }, 0);
    } else if (
      event.key === "Backspace" &&
      items[index] === "" &&
      items.length > 1
    ) {
      event.preventDefault();
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange(newItems);
    }
  };

  return (
    <ul
      className={cn(
        "space-y-[var(--slide-space-1)] text-[color:var(--slide-fg)]",
        className
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={item.startsWith("[x] ")}
            className="form-checkbox accent-[color:var(--slide-accent)]"
            disabled={!isEditable}
            onChange={() => toggleCheckBox(index)}
          />
          <ListItem
            item={item.replace(/^\[[ x]\] /, "")}
            index={index}
            isEditable={isEditable}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </li>
      ))}
    </ul>
  );
};

export default NumberedList;
