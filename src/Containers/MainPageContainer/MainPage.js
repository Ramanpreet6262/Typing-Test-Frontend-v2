import React, { useState, useEffect } from 'react';
import './MainPage.css';
// import generateWords from '../../utils/generateWords';
import useKeyPress from '../../hooks/useKeyPress';
import currentTime from '../../utils/time';
import ResultModal from '../../Components/Modal/Modal';
import UIfx from 'uifx';
import keyPressAudio from '../../keypress.mp3';
import Loader from '../../Components/Loader/Loader';
import { db } from '../../firebaseConfig';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../../libs/contextLib';
import axios from '../../utils/axiosInstance';

// Passing keypress audio to uifx to use it to play on particular events..
const keyAudio = new UIfx(keyPressAudio);

// Generating random words initially
// const words = generateWords();

const MainPage = () => {
  // timeInterval variable to use in setInterval and clearInterval
  let timeInterval = null;

  // various state variables to use in logic for our app
  // const [currentChar, setCurrentChar] = useState(words.charAt(0));
  // const [incomingChars, setIncomingChars] = useState(words.substr(1));
  const [currentChar, setCurrentChar] = useState('');
  const [incomingChars, setIncomingChars] = useState('');
  const [wordsArray, setWordsArray] = useState([]);
  const [currentObj, setCurrentObj] = useState({
    strTyped: '',
    hasErr: false
  });
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [correctTypedChars, setCorrectTypedChars] = useState(0);
  const [startTime, setStartTime] = useState();
  const [incorrectWords, setIncorrectWords] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isWordCorrect, setIsWordCorrect] = useState(true);
  const [timer, setTimer] = useState(60);
  // const [timer, setTimer] = useState(10);
  const [isTimeFinished, setIsTimeFinished] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAppContext();

  // Passing a callback method to imported useKeyPress custom hook method
  // And key parameter is passed from this hook on keypress to this callback method
  useKeyPress(key => {
    let updatedIncomingChars = incomingChars;
    let newCurrentObj = currentObj;
    let newWordsArray = wordsArray;

    // starting the timer on first keypress
    if (!startTime) {
      setStartTime(currentTime());
      startTimer();
    }

    // If time is not finished, then only logic will run on keyPress
    if (!isTimeFinished) {
      // When pressed key is same as the key to type
      if (key === currentChar) {
        // play audio
        keyAudio.setVolume(0.4).play();

        // logic for the characters that are getting typed
        if (currentObj.hasErr === false) {
          newCurrentObj.strTyped += currentChar;
          setCurrentObj(newCurrentObj);
        } else if (currentObj.hasErr === true) {
          newWordsArray.push(newCurrentObj);
          setWordsArray(newWordsArray);
          newCurrentObj = {
            strTyped: currentChar,
            hasErr: false
          };
          setCurrentObj(newCurrentObj);
        }

        // logic for current character to type
        setCurrentChar(incomingChars.charAt(0));

        // logic for characters that will be typed in future
        updatedIncomingChars = incomingChars.substring(1);
        if (updatedIncomingChars.split(' ').length < 10) {
          updatedIncomingChars += ' ' + generateWords();
        }
        setIncomingChars(updatedIncomingChars);

        // logic to update total chars typed and total correct chars typed
        const updatedTotalTypedChars = totalTypedChars + 1;
        setTotalTypedChars(updatedTotalTypedChars);
        const updatedCorrectTypedChars = correctTypedChars + 1;
        setCorrectTypedChars(updatedCorrectTypedChars);

        // logic to update word count and current word index
        if (incomingChars.charAt(0) === ' ') {
          if (isWordCorrect) {
            setWordCount(wordCount + 1);
          }
          setCurrentIndex(currentIndex + 1);
          setIsWordCorrect(true);
        }
      } else if (key === 'Backspace') {
        // When pressed key is backspace

        // Backspace functionality only runs if there is atleast one character typed already
        if (currentObj.strTyped.length > 0) {
          // play audio
          keyAudio.setVolume(0.4).play();

          let newCurrentObj = currentObj;
          let newWordsArray = wordsArray;
          let newIsWordCorrect = isWordCorrect;
          let newCurrentIndex = currentIndex;

          // logic to update total correct chars typed and for bringing back already typed chars
          if (newCurrentObj.hasErr === false) {
            const updatedCorrectTypedChars = correctTypedChars - 1;
            setCorrectTypedChars(updatedCorrectTypedChars);
          }
          let lastChar = newCurrentObj.strTyped.slice(-1);

          let newStr = newCurrentObj.strTyped.substr(
            0,
            currentObj.strTyped.length - 1
          );

          if (newStr.length === 0 && newWordsArray.length !== 0) {
            let newObj = newWordsArray.pop();
            setCurrentObj(newObj);
            setWordsArray(newWordsArray);
          } else {
            setCurrentObj({
              ...currentObj,
              strTyped: newStr
            });
          }

          // logic for current char to type
          const currentCharr = currentChar;
          setCurrentChar(lastChar);

          // logic to update chars that will be typed in future
          updatedIncomingChars = currentCharr + incomingChars;
          setIncomingChars(updatedIncomingChars);

          // logic to update total chars typed
          const updatedTotalTypedChars = totalTypedChars - 1;
          setTotalTypedChars(updatedTotalTypedChars);

          // logic to update word count, current word index and whether word is correct or not
          if (currentCharr === ' ') {
            newCurrentIndex = currentIndex - 1;
            setCurrentIndex(newCurrentIndex);
            if (
              incorrectWords[newCurrentIndex] &&
              incorrectWords[newCurrentIndex].length > 0
            ) {
              newIsWordCorrect = false;
              setIsWordCorrect(false);
            } else {
              newIsWordCorrect = true;
              setIsWordCorrect(true);
              setWordCount(wordCount - 1);
            }
          }
          if (!newIsWordCorrect) {
            let indexArr = incorrectWords[newCurrentIndex];
            if (indexArr.slice(-1) >= totalTypedChars - 1) {
              indexArr.pop();
              let newIncorrectWords = {
                ...incorrectWords
              };
              newIncorrectWords[newCurrentIndex] = indexArr;
              setIncorrectWords(newIncorrectWords);
            }
            if (indexArr.length === 0) {
              setIsWordCorrect(true);
            }
          }
        }
      } else {
        // When pressed key doesn't match with the key to type

        let newCurrentObj = currentObj;
        let newWordsArray = wordsArray;

        // logic to update already typed chars
        if (currentObj.hasErr === true) {
          newCurrentObj.strTyped += currentChar;
          setCurrentObj(newCurrentObj);
        } else if (currentObj.hasErr === false) {
          newWordsArray.push(newCurrentObj);
          setWordsArray(newWordsArray);
          newCurrentObj = {
            strTyped: currentChar,
            hasErr: true
          };
          setCurrentObj(newCurrentObj);
        }

        // logic to update current char to type
        setCurrentChar(incomingChars.charAt(0));

        // logic to update the chars which will be typed in future
        updatedIncomingChars = incomingChars.substring(1);
        if (updatedIncomingChars.split(' ').length < 10) {
          updatedIncomingChars += ' ' + generateWords();
        }
        setIncomingChars(updatedIncomingChars);

        // logic to update total chars typed and whether word is correct or not
        const updatedTotalTypedChars = totalTypedChars + 1;
        setTotalTypedChars(updatedTotalTypedChars);
        setIsWordCorrect(false);
        if (incorrectWords.hasOwnProperty(currentIndex)) {
          let arr = incorrectWords[currentIndex];
          arr.push(totalTypedChars);
          let newIncorrectWords = {
            ...incorrectWords
          };
          newIncorrectWords[currentIndex] = arr;
          setIncorrectWords(newIncorrectWords);
        } else {
          let newArr = [totalTypedChars];
          let newIncorrectWords = {
            ...incorrectWords
          };
          newIncorrectWords[currentIndex] = newArr;
          setIncorrectWords(newIncorrectWords);
        }
        if (incomingChars.charAt(0) === ' ') {
          setCurrentIndex(currentIndex + 1);
          setIsWordCorrect(true);
        }
      }
    }
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get('/words')
      .then(resp => {
        // console.log(resp);
        setCurrentChar(resp.data.charAt(0));
        setIncomingChars(resp.data.substr(1));
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const generateWords = () => {
    let words = '';
    axios
      .get('/words')
      .then(resp => {
        // console.log(resp);
        words = resp.data;
        // console.log('words');
        // console.log(words);
      })
      .catch(err => {
        console.log(err);
      });
    return words;
  };

  // To clear setInterval on component unmount
  useEffect(() => {
    return () => {
      if (timeInterval !== null) {
        clearInterval(timeInterval);
      }
    };
  });

  // Method to update timer every second and stop it when time finishes
  const startTimer = () => {
    let newTimer = timer;
    timeInterval = setInterval(() => {
      if (newTimer > 0) {
        newTimer -= 1;
        setTimer(newTimer);
        setIsTimeFinished(false);
      } else {
        clearInterval(timeInterval);
        showResult();
      }
    }, 1000);
  };

  // Method to show result modal after time finishes
  // const showResult = () => {
  //   setIsTimeFinished(true);
  //   setShowResultModal(true);
  // };

  async function showResult() {
    setIsTimeFinished(true);
    setShowResultModal(true);

    // let accuracy =
    //   totalTypedChars === 0
    //     ? 0
    //     : ((correctTypedChars * 100) / totalTypedChars).toFixed(2);
    // let wpm = (wordCount / getTimeDur()).toFixed(0);
    // let cpm = (correctTypedChars / getTimeDur()).toFixed(0);
    // console.log(wordCount);

    // console.log(`accuracy, ${accuracy}`);
    // console.log(`wpm, ${wpm}`);
    // console.log(`cpm, ${cpm}`);

    // const currentUser = await Auth.currentAuthenticatedUser();
    // const userEmail = currentUser.attributes.email;
    // const userDocRef = db.collection('users').doc(userEmail);

    // let userDoc = userDocRef
    //   .get()
    //   .then(doc => {
    //     if (doc.exists) {
    //       const data = doc.data();
    //       console.log(data);
    //     } else {
    //       console.log('No such document!');
    //     }
    //   })
    //   .catch(err => {
    //     alert(
    //       `Error occured while fetching recent user data. Please refresh page!!`
    //     );
    //   });
  }

  // Method to close result modal on click outside of it
  // const handleModalClose = () => {
  async function handleModalClose() {
    setShowResultModal(false);

    if (isAuthenticated) {
      setLoading(true);

      let accuracy =
        totalTypedChars === 0
          ? 0
          : ((correctTypedChars * 100) / totalTypedChars).toFixed(2);
      let wpm = (wordCount / getTimeDur()).toFixed(0);
      let cpm = (correctTypedChars / getTimeDur()).toFixed(0);
      let testData = {
        accuracy: accuracy,
        cpm: cpm,
        wpm: wpm,
        addedAt: new Date()
      };

      const currentUser = await Auth.currentAuthenticatedUser();
      const userEmail = currentUser.attributes.email;
      const userDocRef = db.collection('users').doc(userEmail);

      let userDoc = userDocRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            console.log(data);
            data.tests.push(testData);
            if (cpm > data.maxCpm) {
              data.maxCpm = cpm;
            }
            // data.addedAt = new Date();
            const setDoc = userDocRef.set(data);
          } else {
            console.log('No such document!');
            let testArr = [];
            testArr.push(testData);
            const data = {
              maxCpm: cpm,
              tests: testArr
              // addedAt: new Date()
            };
            const setDoc = userDocRef.set(data);
          }
        })
        .catch(err => {
          alert(
            `Error occured while fetching recent user data. Please refresh page!!`
          );
        });

      setLoading(false);
    }

    resetSettings();
  }

  // Method to reset all settings to allow user to play again
  const resetSettings = () => {
    setLoading(true);

    axios
      .get('/words')
      .then(resp => {
        // console.log(resp);
        timeInterval = null;

        setCurrentChar(resp.data.charAt(0));
        setIncomingChars(resp.data.substr(1));
        setWordsArray([]);
        setCurrentObj({
          strTyped: '',
          hasErr: false
        });
        setTotalTypedChars(0);
        setCorrectTypedChars(0);
        setStartTime(null);
        setIncorrectWords({});
        setCurrentIndex(0);
        setWordCount(0);
        setIsWordCorrect(true);
        setTimer(60);
        // setTimer(10);
        setIsTimeFinished(false);

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        console.log('please refresh page');
      });

    // const newWords = generateWords();
    // timeInterval = null;
    // setCurrentChar(newWords.charAt(0));
    // setIncomingChars(newWords.substr(1));
    // setWordsArray([]);
    // setCurrentObj({
    //   strTyped: '',
    //   hasErr: false
    // });
    // setTotalTypedChars(0);
    // setCorrectTypedChars(0);
    // setStartTime(null);
    // setIncorrectWords({});
    // setCurrentIndex(0);
    // setWordCount(0);
    // setIsWordCorrect(true);
    // setTimer(60);
    // // setTimer(10);
    // setIsTimeFinished(false);
  };

  // Method to calculate time duration passed at a particular moment in the game.
  const getTimeDur = () => {
    if (!isTimeFinished) {
      return (currentTime() - startTime) / 60000.0;
    } else {
      return 60 / 60.0;
      // return 10 / 10.0;
    }
  };

  // logic to show only 20 characters on left of current char cursor, so as to keep position of
  // current char cursor static and in center of screen
  let counter = 20;
  let finalArr = [];
  let typeArr = [...wordsArray, currentObj];
  for (let i = typeArr.length - 1; i >= 0; i--) {
    if (typeArr[i].strTyped.length > counter) {
      let typedStr = typeArr[i].strTyped.substr(-counter, counter);
      let spanTag = (
        <span
          className={typeArr[i].hasErr ? 'Character-err' : 'Character-out'}
          key={i}
        >
          {typedStr}
        </span>
      );
      finalArr.push(spanTag);
      counter = 0;
      break;
    } else {
      let typedStr = typeArr[i].strTyped;
      let spanTag = (
        <span
          className={typeArr[i].hasErr ? 'Character-err' : 'Character-out'}
          key={i}
        >
          {typedStr}
        </span>
      );
      finalArr.push(spanTag);
      counter = counter - typedStr.length;
    }
  }

  if (counter > 0) {
    let emptyStr = new Array(counter).fill(' ').join('');
    let spanTag = (
      <span className='Character-out' key={-1}>
        {emptyStr}
      </span>
    );
    finalArr.push(spanTag);
  }

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className='App'>
        <header className='App-header'>
          <h3 className='timer-block'>
            Timer:{' '}
            {timer < 10 ? (
              <span className='red-timer'>{timer}sec</span>
            ) : (
              timer + 'sec'
            )}
          </h3>
          <p className='Character'>
            {finalArr.reverse()}
            <span className='Character-current'>{currentChar}</span>
            <span>{incomingChars.substr(0, 20)}</span>
          </p>
          <div className='parameters-div'>
            <h3>
              Errors: {totalTypedChars - correctTypedChars}/
              <span className='totalChars'>{totalTypedChars}</span> | Accuracy:{' '}
              {totalTypedChars === 0
                ? 0
                : ((correctTypedChars * 100) / totalTypedChars).toFixed(2)}
              %
            </h3>
            <h3>
              Speed=> CPM:{' '}
              {startTime ? (correctTypedChars / getTimeDur()).toFixed(0) : 0} |
              WPM: {startTime ? (wordCount / getTimeDur()).toFixed(0) : 0}
            </h3>
          </div>
        </header>
        <ResultModal open={showResultModal} handleClose={handleModalClose}>
          <h1 className='result-heading'>
            Your typing speed is{' '}
            <span className='result-wpm'>
              {startTime ? (wordCount / getTimeDur()).toFixed(0) : 0}WPM
            </span>
          </h1>
          <div className='result-typingspeed'>
            <p className='typing-speed-heading'>Typing Speed</p>
            <p className='typing-speed-content'>
              {startTime ? (correctTypedChars / getTimeDur()).toFixed(0) : 0}
              <span className='unfocused-content'>CPM</span> |{' '}
              {startTime ? (wordCount / getTimeDur()).toFixed(0) : 0}
              <span className='unfocused-content'>WPM</span>
            </p>
          </div>
          <div className='result-accuracy'>
            <p className='accuracy-heading'>Accuracy</p>
            <p className='accuracy-content'>
              {totalTypedChars === 0
                ? 0
                : ((correctTypedChars * 100) / totalTypedChars).toFixed(2)}
              <span className='unfocused-content'>%</span>
            </p>
          </div>
        </ResultModal>
      </div>
    );
  }
};

export default MainPage;
