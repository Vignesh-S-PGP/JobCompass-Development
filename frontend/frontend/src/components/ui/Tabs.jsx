import { motion } from "framer-motion";

const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-1 p-1 bg-muted/30 rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-foreground ${
            activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-background rounded-md shadow-sm border border-border"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
