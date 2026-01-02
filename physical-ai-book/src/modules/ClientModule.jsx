import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import GlobalChatbot from '../components/Chatbot/GlobalChatbot';

const ClientModule = () => {
  if (ExecutionEnvironment.canUseDOM) {
    return <GlobalChatbot />;
  }
  return null;
};

export default ClientModule;