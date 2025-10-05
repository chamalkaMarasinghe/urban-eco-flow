// NOTE: core dependencies
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from 'react-router-dom';

// NOTE: third party dependencies
// import socketIO from "socket.io-client";

// NOTE: importing custom hooks
import { useThunk } from "../hooks/useThunk";

// NOTE: components
import UserList from "../components/pagesSpecific/thread/UserList";
import Header from "../components/pagesSpecific/thread/ThreadHeader"
import MessageList from "../components/pagesSpecific/thread/MessageList";
import MessageInput from "../components/pagesSpecific/thread/MessageInput";
// import ServiceOffer from "../../components/ServiceOffer";
import Input from "../components/Reusable/Input";

// NOTE: extracrting current environment and it's properties
// import { CONFIGURATIONS } from "../../config/envConfig";
import {
  // acceptOffer,
  fetchChats,
  fetchSingleThread,
  fetchThreads,
} from "../store/thunks/threadThunks";
import showToast from "../utils/toastNotifications";
import {
  firebaseUplaodFolders,
  maximumImagesUploadingSizes,
  messageTypes,
  offerStatus,
} from "../constants/commonConstants";
// import { message } from "antd";
// import Item from "antd/es/list/Item";
import useFirebaseFileUpload from "../hooks/useFirebaseFileUpload";
// import NotFound from "../../components/NotFound";

// NOTE: initializing the client socket
// const socket = socketIO.connect(CONFIGURATIONS.API_BASE_SOCKET_DOMAIN, {
//   auth: {
//     token: localStorage.getItem("token"),
//   },
// });

import { useSocket } from "../context/socket/socketContext";
import { useLanguage } from "../context/language/language";
import { FaArrowLeft } from "react-icons/fa6";

// NOTE: const values
const SIZE = 10000;

const Thread = () => {
  // NOTE: client side socket initializing
  const socket = useSocket();
  const {language} = useLanguage();

  // NOTE: signed in user state
  const userState = useSelector((state) => state?.auth?.user);
  const navigate = useNavigate();

  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // NOTE: extracting the thread is query parameter if exists
  const [searchParams, setSearchParams] = useSearchParams();

  // const currentLoginUser = "67a9c3f5e57bc3b49b29e714";

  // NOTE: defining states ===============================================================================================

  // STATE: threads - left side bar
  const [threads, setThreads] = useState([]);

  // STATE: chats - messages of single thread
  const [chats, setChats] = useState([]);

  // STATE: user clicked thread (selected thread)
  const [selectedThread, setSelecteThread] = useState(null);

  // STATE: user type and serach threads by user name
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get("searchTerm") || "",
  });

  // STATE: For tracking the real-time filter changes before debouncing
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // STATE: decides whether to show the related chats of a thread on right side panael or not when user clicked on a left side thread
  const [showChat, setShowChat] = useState(false);

  // STATE: thread pagination model
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: SIZE,
  });
  const threadIdSearchParam = searchParams.get("thread") || null;

  // STATE: total available number of threeads
  const [totalNumOfRecords, setTotalNumOfRecords] = useState(0);

  // STATE: test messages to be send
  const [text, setText] = useState("");

  // State to store deliver documents
  const [uploadFiles, setUploadFiles] = useState([]);

  // NOTE: defining refs =================================================================================================

  const userIdRef = useRef(userState?._id?.toString() || "");
  // const roleRef = useRef(
  //   tokenPayload?.roles ? tokenPayload?.roles[0] : roles.USER
  // );
  const selectedThreadRef = useRef(selectedThread);
  const threasdsRef = useRef(threads);
  const chatRef = useRef(chats);

  // NOTE: importing thunks ===============================================================================================

  const [doFetchThreads, isFetchThreads, errorFetchThreads] =
    useThunk(fetchThreads);
  const [doFetchChats, isFetchChats, errorFetchChats] = useThunk(fetchChats);
  // const [doAcceptOffer, isAcceptOffer, errorAcceptOffer] =
  //   useThunk(acceptOffer);
  const [doFetchSingleThread, isFetchSingleThread, errorFetchSingleThread] =
    useThunk(fetchSingleThread);
  const [uploadFilesToFirebase, isFileUploading, fileUploadError] =
    useFirebaseFileUpload();

  // NOTE: defining side effects ==========================================================================================

  // STATE: defining event listeners
  // useEffect(() => {
  //   // //handle screen size resize event listeners
  //   // const handleResize = () => {
  //   //   setIsScreenLarge(window.innerWidth >= 1440);
  //   //   setIsScreenMedium(window.innerWidth >= 640);
  //   //   setIsScreenSmall(window.innerWidth >= 360);
  //   // };

  //   // NOTE: clear redux storage - threads properties
  //   const handleUnload = () => {
  //     // NOTE: disconnectiong the socket connection before leave from the page/tab/browser
  //     if (socket.connected) {
  //       socket.disconnect();
  //     }
  //     // dispatch(clearThreads());
  //     // dispatch(clearSelectedThreadAndOrder());
  //   };

  //   // invoking methods based on if query parameters exists or if query parametrs does not exist
  //   // query paramerts exists if this thread page loaded from my order table : view order selected
  //   // query parametrs does not exist if this thread page loaded as general option
  //   // if (roomIdSearchParam && threadIdSearchParam) {
  //   //   refetchSelectedThreadAndOrderFromQueryParams();
  //   // } else {
  //   //   refetchSelectedThreadAndOrder();
  //   // }

  //   // NOTE: triggered when user leaves/close browser, tab or navigates away
  //   window.addEventListener("beforeunload", handleUnload);
  //   // detect screen sizes
  //   // window.addEventListener("resize", handleResize);

  //   // NOTE: cleanup functions
  //   return () => {
  //     window.removeEventListener("beforeunload", handleUnload);
  //     // window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // STATE: fetch user threads accroding to paginatin modal
  useEffect(() => {
    // invoking for fetch user threads
    // if (
    //   thread.threads?.length % SIZE === 0 &&
    //   !thread?.selectedPage &&
    //   !roomIdSearchParam &&
    //   !threadIdSearchParam
    // ) {

    const newParams = new URLSearchParams(searchParams);
    newParams.set("searchTerm", filters?.searchTerm);
    setSearchParams(newParams);

    if (!threadIdSearchParam) {
      fetchAllUserThreads(
        {
          offset: pagination?.offset,
          limit: pagination.limit,
        },
        filters?.searchTerm
      );
    } else {
      fetchAllUserThreads(
        { offset: pagination?.offset, limit: 10 },
        filters?.searchTerm,
        true
      );
    }
    // }
  }, [pagination, filters]);

  // STATE: Debounce effect for applying filter changes
  useEffect(() => {
    // NOTE: Only create debounce timer if userName has changed
    if (debouncedFilters.searchTerm === filters.searchTerm) return;

    const timer = setTimeout(() => {
      // NOTE: Update filters with the debounced value
      setFilters((prev) => ({
        ...prev,
        searchTerm: debouncedFilters.searchTerm,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedFilters.searchTerm]);

  // STATE: client socket join with their each associated rooms
  useEffect(() => {
    // NOTE: Explicitly connect the socket
    // socket.auth = { token: localStorage.getItem("token") };
    // socket.connect();

    if (threads?.length > 0 && userState?._id != "") {
      socket.emit("join-room", {
        userId: userState?._id || "",
        // role: tokenPayload?.roles ? tokenPayload?.roles[0] : "",
      });
    }

    socket.on("joinRoomResponse", (res) => {
      console.log(res);
    });

    return () => {
      socket.off("joinRoomResponse");
    };
  }, [threads]);

  // STATE: emiting events for track who are the active viewing users of threads at this moment
  useEffect(() => {
    if (selectedThread) {
      socket.emit("open-thread", {
        userId: userState?._id || "",
        roomId: selectedThread?._id || "",
      });

      // NOTE:Handler for closing thread on refresh or tab/browser close
      const handleUnload = () => {
        socket.emit("close-thread", {
          userId: userState?._id || "",
          roomId: selectedThread?._id || "",
        });
      };

      // NOTE: Listen to beforeunload event for cleanup on refresh or close
      window.addEventListener("beforeunload", handleUnload);

      // NOTE: Cleanup
      return () => {
        window.removeEventListener("beforeunload", handleUnload);
        socket.emit("close-thread", {
          userId: userState?._id || "",
          roomId: selectedThread?._id || "",
        });
      };
    }
  }, [selectedThread]);

  // STATE: client socket listening for incoming messages or errors
  useEffect(() => {
    socket.on("messageResponse", (data) => {
      console.log(data);

      // NOTE: updating the offer object after decline by the user
      if (data?.offerDeclined || data?.offerCanceled) {
        updateDeclinedThread(
          data?.offer?._id,
          data?.offerDeclined,
          data?.offerCanceled
        );
      }

      // NOTE: append incoming messages to the opened chats
      appendMessageToRelatedChat(data);
    });

    socket.on("error", (error) => {
      console.log("Server error:", error);
      showToast("error", error?.message || "Error Occurred");
    });

    return () => {
      socket.off("messageResponse");
      socket.off("error");
    };
  }, [socket]);

  // STAT: fetch single thread if there is thread id query param
  // useEffect(() => {
  //   console.log('1');
  //   console.log(threads);

  //   const loadSinghleThreadMethod = async() => {
  //     if(threadIdSearchParam){
  //       console.log(threads);
  //       const response = await fetchSingleUserThreads(threadIdSearchParam);
  //       selectedThreadRef.current = response;
  //       setSelecteThread(response);
  //       setShowChat(true);
  //       fetchUserThreadChatsMethod(response, false);
  //     }
  //   };

  //   loadSinghleThreadMethod();
  // }, [threadIdSearchParam]);

  // NOTE: action handling methods ========================================================================================

  // FUNCTION: Handle search input change - update the debounced value
  const handleSearchChange = (e) => {
    setDebouncedFilters((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
  };

  // FUNCTION: user clicks on the thred in lef side bar
  const handleSelectUser = (user) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("searchTerm", filters?.searchTerm);
    newParams.set("thread", user?._id);
    setSearchParams(newParams);

    // setSearchParams({ thread: user?._id });

    selectedThreadRef.current = user;
    setSelecteThread(user);
    setShowChat(true);
    fetchUserThreadChatsMethod(user);
  };

  // FUNCTION: user accept the offer
  // const handleAcceptOffer = async (offerId) => {
  //   const response = await doAcceptOffer({
  //     thread: selectedThread?._id,
  //     offer: offerId || "",
  //     user: userState?._id,
  //   });
  //   if (response?.success) {
  //     fetchUserThreadChatsMethod(selectedThread);
  //   } else {
  //     showToast("error", response?.error?.message || "Error Occured");
  //   }
  // };

  // FUNCTION: user decline the offer
  // const handleDeclineOffer = async (offerId) => {
  //   if (selectedThread) {
  //     socket.emit("decline-offer", {
  //       roomId: selectedThread?._id || "",
  //       userId: userState?._id || "",
  //       offerId: offerId || "",
  //     });
  //   }
  // };

  // FUNCTION: tasker cancel the offer
  // const handleCancelOffer = async (offerId) => {
  //   if (selectedThread) {
  //     socket.emit("cancel-offer", {
  //       roomId: selectedThread?._id || "",
  //       userId: userState?._id || "",
  //       offerId: offerId || "",
  //     });
  //   }
  // };

  // FUNCTION: update the offers after declining the offer
  const updateDeclinedThread = (
    offerId,
    offerDeclined = false,
    offerCanceled = false
  ) => {
    let chatPrev = chatRef.current;

    // NOTE: update related offer object message
    const updatedChats = chatPrev?.map((item) => {
      if (
        item?.messageTye === messageTypes.OFFER &&
        typeof item?.offer !== "string" &&
        Object.values(item?.offer)?.length > 0 &&
        item?.offer?._id?.toString() === offerId?.toString()
      ) {
        if (offerDeclined) {
          item.offer.status = offerStatus.DECLINED;
        }
        if (offerCanceled) {
          item.offer.status = offerStatus.CANCELLED;
        }
      }
      return item;
    });

    setChats(updatedChats);
    chatRef.current = updatedChats;
  };

  // FUNCTION: method to be used to send inbox messages
  const handleSendMessage = async ({
    // isOffer = false,
    // offerObj = null,
    attachmentFiles = [],
    setSelectedFiles = null,
  }) => {
    let downloadURLs = [];

    // NOTE: creating offer object
    // const isOffer = true;
    // let offer = null;

    // if (isOffer && offerObj) {
    //   offer = {
    //     title: offerObj?.title,
    //     description: offerObj?.description,
    //     amount: offerObj?.amount,
    //     category: offerObj?.category,
    //     time: offerObj?.time,
    //     date: offerObj?.date,
    //   };
    // }

    if (attachmentFiles?.length > 0) {
      const fileUploadResult = await uploadFilesToFirebase(
        attachmentFiles,
        firebaseUplaodFolders.F_MESSAGES_ATTACHMENTS,
        maximumImagesUploadingSizes.size_450KB
      );
      if (!fileUploadResult.success) {
        showToast("error", "Failed to upload attachments");
      } else {
        downloadURLs = fileUploadResult?.uploadedUrls || [];
      }
    }

    if (
      (text && text.toString().trim().length > 0) ||
      downloadURLs?.length > 0 
      // ||
      // (isOffer && Object.values(offer)?.length > 0)
    ) {
      socket.emit("message", {
        roomId: selectedThread?._id || "",
        userId: userIdRef ? userIdRef.current : "",
        text: text,
        // role: roleRef ? (roleRef.current)?.toLowerCase() : '',
        files: downloadURLs || [],
        // mentionedList: currentMentionedUsersRef.current
        // isOffer: isOffer,
        // offer: offer ? offer : {},
      });
      setText("");
      setUploadFiles([]);
      if (setSelectedFiles) {
        setSelectedFiles([]);
      }
      // setCurrentMentionedUsers([]);
      // if(currentMentionedUsers.current){
      //     currentMentionedUsers.current = [];
      // }
    }
  };

  // NOTE: chat handling methods ==========================================================================================

  // FUNCTION: method to be used to swap the threads to top of the threads list when it getting new incoming messages & increment unread count locally
  const swapThreads = (prevThreads, roomId, userId) => {
    return new Promise(async (resolve, reject) => {
      let targetIndex = -1;
      let prev = prevThreads ? prevThreads : [];

      for (let i = 0; i < prev.length; i++) {
        if (prev[i]?._id?.toString() === roomId?.toString()) {
          targetIndex = i;
          break;
        }
      }

      // NOTE: targetIndex not null means, the thread exist locally which is related to incoming recent message
      if (targetIndex > -1) {
        for (let j = targetIndex; j > 0; j--) {
          let temp = prev[j];
          prev[j] = prev[j - 1];
          prev[j - 1] = temp;
        }
      } else {
        // let res = await doFetchThreadById({ roomId: roomId });
        // // Using the splice() method to remove from the last nth index for n elements
        // prev.splice(prev.length - 1, 1);
        // if (res.success) {
        //   prev = [res.response.data, ...prev];
        // } else {
        //   showToast("error", res?.error?.message || "Error Occurred!");
        // }
      }
      return resolve([...prev]);
    });
  };

  // FUNCTION: method to be used to append incoming message to related chat - as well as update the currently open chats if any
  const appendMessageToRelatedChat = async (newMessage) => {
    let threadPrev = selectedThreadRef.current;
    let chatPrev = chatRef.current;
    let prevUserId = userIdRef.current;

    // NOTE: update the open chat if any
    if (newMessage?.roomId === threadPrev?._id) {
      // dispatch(setThreadBulkChats([...chatPrev, {sender: newMessage?.userId, content : newMessage?.text, attachments: newMessage?.attachments || [], createdAt: newMessage?.createdAt, isAdmin: newMessage?.isAdmin || false}]));
      setChats([
        {
          ...newMessage,
          sender: newMessage?.userId,
          content: newMessage?.text,
          attachments: newMessage?.attachments || [],
          createdAt: newMessage?.createdAt,
          // isAdmin: newMessage?.isAdmin || false
        },
        ...chatPrev,
      ]);
      chatRef.current = [
        {
          ...newMessage,
          sender: newMessage?.userId,
          content: newMessage?.text,
          attachments: newMessage?.attachments || [],
          createdAt: newMessage?.createdAt,
          // isAdmin: newMessage?.isAdmin || false
        },
        ...chatPrev,
      ];
    }

    // NOTE: update the last message of matching thread and locally increment the incoming unread message count
    let updatedThreads = threasdsRef.current.map((thread) => {
      if (newMessage?.roomId === thread?._id) {
        return {
          ...thread,
          lastMessage: {
            ...newMessage,
            sender: newMessage?.userId,
            content: newMessage?.text,
            attachments: newMessage?.attachments || [],
            createdAt: newMessage?.createdAt,
          },
          lastRead: thread?.lastRead?.map((item) => {
            if (
              item?.userId?.toString() === prevUserId?.toString() &&
              thread?._id?.toString() !== threadPrev?._id?.toString()
            ) {
              return { ...item, unreadCount: parseInt(item.unreadCount) + 1 };
            }
            return item;
          }),
        };
      }
      return thread;
    });

    const swapperThreads = await swapThreads(
      updatedThreads,
      newMessage?.roomId?.toString(),
      prevUserId
    );
    // dispatch(setBulkThreads(w));
    setThreads(swapperThreads);
    threasdsRef.current = swapperThreads;
    return swapperThreads;
  };

  // NOTE: data fetching methods ==========================================================================================

  // FUNCTION: Fetch all user threads
  const fetchAllUserThreads = async (
    pagination = { offset: 0, limit: 10 },
    searchTerm = null,
    singleThread = false
  ) => {
    try {
      const result = await doFetchThreads({
        offset: pagination.offset,
        limit: pagination.limit,
        searchTerm,
      });

      if (result?.success) {
        // threasdsRef.current = [...threads, ...result.response?.data?.data];
        // setThreads([...threads, ...result.response?.data?.data]);
        threasdsRef.current = result.response?.data?.data;
        setThreads(result.response?.data?.data);

        setTotalNumOfRecords(result.response?.data?.pagination?.totalDocuments);

        if (singleThread && threadIdSearchParam) {
          const response = await fetchSingleUserThreads(threadIdSearchParam);
          selectedThreadRef.current = response;
          setSelecteThread(response);
          fetchUserThreadChatsMethod(response, false, threasdsRef.current);
          setShowChat(true);
        }
        // if (
        //   thread.selectedOrder &&
        //   thread.selectedThread &&
        //   !thread.selectedPage
        // ) {
        //   dispatch(setSelectedPage(pagination.page));
        // }
      }

      if (!result.success) {
        showToast("error", result.error?.message);
      }
    } catch {
      showToast("error", "Error occurred during fetching threads.");
    }
  };

  // FUNCTION: fetch thread chats
  const fetchUserThreadChatsMethod = async (
    selectedThread,
    doSwap = true,
    threadsReference = null
  ) => {
    try {
      const result = await doFetchChats({
        offset: 0,
        limit: 1000,
        thread: selectedThread?._id,
      });

      if (result.success) {
        chatRef.current = result?.response?.data?.data;
        setChats(result?.response?.data?.data);
        // if(doSwap){
        // NOTE: clear the unread message count in client side: cleare the unread count of matching record; restore the record
        const prevThreads = threadsReference || threads;
        const newThreads = prevThreads.map((threadParameter) => {
          if (
            threadParameter?._id?.toString() === selectedThread?._id?.toString()
          ) {
            return {
              ...threadParameter,
              lastRead: threadParameter?.lastRead?.map((item) => {
                if (
                  item?.userId?.toString() === userIdRef.current?.toString()
                ) {
                  return { ...item, unreadCount: 0 };
                }
                return item;
              }),
            };
          }
          return threadParameter;
        });
        threasdsRef.current = newThreads;
        // dispatch(setBulkThreads(newThreads));
        setThreads(newThreads);
        // }
      }

      if (!result.success) {
        showToast("error", result.error?.message);
      }
    } catch {
      showToast("error", "Error occurred during fetching chats.");
    }
  };

  // FUNCTION: Fetch single user threads
  const fetchSingleUserThreads = async (threadId = "") => {
    try {
      const result = await doFetchSingleThread(threadId || "");

      if (result?.success) {
        return result?.response?.data;
      }

      if (!result.success) {
        showToast("error", result.error?.message || "Error Occurred");
        return null;
      }
    } catch {
      showToast("error", "Error occurred during fetching threads.");
      return null;
    }
  };

  return (
    <>
      <title>Chat with Us</title>
      <div className="flex flex-col flex-grow h-[80vh] max-h-[95vh] mb-[5px] -translate-y-3 px-[20px] md:px-[30px] lg:px-[40px]">
        <div className="flex border h-[100%] border-[#CBD5E0] rounded-[12px] overflow-hidden">
          {/* Sidebar */}
          <div
            className={`w-full lg:w-[350px] border-r rounded-r-none rounded-l-[12px] border-[#E6E7EC] flex flex-col ${
              showChat ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="px-6">
          
              <div className="flex items-center justify-between mt-[24px] mb-[36px]">
                  <div className="flex flex-row text-xl font-semibold text-dark-black font-inter">
                      <span className="flex items-center" onClick={() => navigate("/")}>
                              <FaArrowLeft  size={20} className="cursor-pointer text-primary"/>
                      </span>
                      <div className="flex justify-start h-[100%] ml-2 items-center">
                        Messages
                    </div>
                  </div>
              </div>
              <Input
                type="text"
                placeholder="Search"
                searchIcon={true}
                inputStyle="pl-10 font-roboto w-full h-12 bg-white border border-[#CBD5E0] rounded-[4px] focus:outline-none focus:border-light-orange focus:ring-1"
                onChange={handleSearchChange}
                value={debouncedFilters.searchTerm}
              />
            </div>
            <div className="bg-[#1B1A1A05] overflow-y-auto scrollbar-chat">
              <UserList
                users={threads}
                onSelectUser={handleSelectUser}
                selectedUser={selectedThread}
                loading={isFetchThreads}
              />
            </div>
          </div>

          {/* Chat Section */}
          <div
            className={`flex-1 flex flex-col overflow-x-hidden ${
              !showChat ? "hidden lg:flex" : "flex"
            }`}
          >
            {selectedThread ? (
              <>
                <Header
                  user={selectedThread}
                  onBack={() => setShowChat(false)}
                  isHidden={selectedThread?.serviceprovider === undefined }
                />
                <MessageList
                  messages={chats}
                  // acceptOfferMethod={handleAcceptOffer}
                  // declineOfferMethod={handleDeclineOffer}
                  // cancelOfferMethod={handleCancelOffer}
                  threadId={selectedThread?._id}
                />
                <MessageInput
                  onSendMessage={handleSendMessage}
                  text={text}
                  setText={setText}
                  loading={isFileUploading}
                  isHidden={selectedThread?.serviceprovider === undefined }
                />
              </>
            ) : (
              <div className="flex justify-center items-center h-[100%] w-full">
                {/* <NotFound message="Select Threads"/> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Thread;
