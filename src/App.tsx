import { useState } from "react";
import "./styles/convert.scss";

//Can a single syllable verb end in a vowel?
function App() {
  const vowels = ["a", "e", "i", "o", "u"];
  const stressedVowels = ["á", "é", "í", "ó", "ú"];
  const charactersThatTakeW = ["c", "g", "g̓", "k", "k̓", "q", "q̓", "x"];
  const doubleCharactersThatTakeGlottal = ["k", "g", "q"];

  const [perspective, setPerspective] = useState<string>("firstPersonSingular");
  const [reduplicate, setReduplicate] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [customVerb, setCustomVerb] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPerspective(event.target.value);
    console.log(event.target.value);
  };

  const handleReduplicate = (value: boolean) => {
    setReduplicate(value);
    console.log(value);
  };

  //Form Submission Logic

  const handleSubmit = (verb: string) => {
    console.log(verb);
    const isMultipleSyllable = stressedVowels.some((vowel) =>
      verb.includes(vowel)
    );
    if (!isMultipleSyllable) {
      const indexOfVowelArray = vowels.findIndex(
        (vowel) => verb.indexOf(vowel) !== -1
      );
      verb = verb.replace(
        vowels[indexOfVowelArray],
        stressedVowels[indexOfVowelArray]
      );
    }
    let lastChar = verb.charAt(verb.length - 1);
    if (lastChar === "7") {
      lastChar = verb.charAt(verb.length - 2) + "7";
    }
    switch (lastChar) {
      case "k":
      case "k̓":
      case "c":
        setOutput(endInKCk̓(verb));
        break;

      case "e":
        setOutput(endInE(verb));
        break;

      case "e7":
        setOutput(endInE7(verb));
        break;

      default:
        setOutput(endInOthers(verb));
    }
  };

  const handleFirstPersonSingular = (verb: string) => {
    if (reduplicate) {
      console.log(verb.charAt(0));
      // check if first char is a vowel
      if (stressedVowels.includes(verb.charAt(0))) {
        //make second character a 7 and reduplicate unstressed vowel after it
        console.log("hit");
        let part1 = verb.substring(0, 1);
        let part2 = verb.substring(1);
        return (
          "ec re " +
          part1 +
          "7" +
          vowels[stressedVowels.indexOf(part1)] +
          part2 +
          "wen"
        );
      }
      //reduplicate if first character is not a vowel

      //find stressed vowel
      let stressedVowel = stressedVowels.find((vowel) => verb.includes(vowel));
      //@ts-ignore
      let indexOfStressedVowel = verb.indexOf(stressedVowel);

      //handle reduplication
      let part1 = verb.substring(0, indexOfStressedVowel + 1);
      let part2 = verb.substring(indexOfStressedVowel + 1);
      // console.log(part1);
      // console.log(part2);

      //CHECK IF Y IS USUALLY CHANGED TO I like in the book
      ///////////
      part2 = part2.charAt(0) === "y" ? part2.replace("y", "i") : part2;
      ///////////////

      let characterToBeReduplicated = part1[part1.length - 2];
      console.log(characterToBeReduplicated);

      if (
        characterToBeReduplicated === "w" &&
        charactersThatTakeW.includes(part1[part1.length - 3])
      ) {
        characterToBeReduplicated = part1[part1.length - 3] + "w";
      } else if (
        characterToBeReduplicated === "l" &&
        part1[part1.length - 3] === "l"
      ) {
        characterToBeReduplicated = "ll";
      } else if (
        characterToBeReduplicated === "s" &&
        part1[part1.length - 3] === "t"
      ) {
        characterToBeReduplicated = "t" + characterToBeReduplicated;

        //HANDLE SINGLE CHARACTER GLOTTALS + ts̓
      } else if (characterToBeReduplicated === "̓") {
        if (
          part1[part1.length - 3] === "s" &&
          part1[part1.length - 4] === "t"
        ) {
          characterToBeReduplicated = "ts̓";
          part1 = part1.replace("ts̓", "ts");
        } else {
          characterToBeReduplicated =
            part1[part1.length - 3] + characterToBeReduplicated;
          part1 = part1.replace(
            characterToBeReduplicated,
            characterToBeReduplicated[0]
          );
        }
      }
      //HANDLE DOUBLE CHARACTER GLOTTALS excluding ts̓
      else if (
        characterToBeReduplicated === "w" &&
        part1[part1.length - 3] === "̓" &&
        doubleCharactersThatTakeGlottal.includes(part1[part1.length - 4])
      ) {
        console.log("caught");
        characterToBeReduplicated = part1[part1.length - 4] + "̓" + "w";
        console.log(characterToBeReduplicated[0]);
        part1 = part1.replace(
          characterToBeReduplicated,
          characterToBeReduplicated.charAt(0) + "w"
        );
      }

      return "ec re " + part1 + characterToBeReduplicated + part2 + "wen";
    }
    //return unreduplicated form
    return "ec re " + verb + "wen";
  };

  const endInKCk̓ = (verb: string) => {
    switch (perspective) {
      case "firstPersonSingular":
        return handleFirstPersonSingular(verb);
      case "secondPersonSingular":
        return "ec re " + verb + "ecw";
      case "thirdPerson":
        return "ec re " + verb + "wes";
      case "firstPersonPluralInc":
        return "ec re " + verb + "wet";
      case "firstPersonPluralExc":
        return "ec re " + verb + "wes kucw";
      case "secondPersonPlural":
        return "ec re " + verb + "wep";
    }
    return "something went wrong";
  };

  const endInE = (verb: string) => {
    switch (perspective) {
      case "firstPersonSingular":
        return handleFirstPersonSingular(verb);
      case "secondPersonSingular":
        return "ec re " + verb.substring(0, verb.length - 1) + "ucw";
      case "thirdPerson":
        return "ec re " + verb.substring(0, verb.length - 1) + "us";
      case "firstPersonPluralInc":
        return "ec re " + verb.substring(0, verb.length - 1) + "ut";
      case "firstPersonPluralExc":
        return "ec re " + verb.substring(0, verb.length - 1) + "us kucw";
      case "secondPersonPlural":
        return "ec re " + verb.substring(0, verb.length - 1) + "up";
    }

    return "Something went wrong";
  };

  const endInE7 = (verb: string) => {
    switch (perspective) {
      case "firstPersonSingular":
        return handleFirstPersonSingular(verb);

      case "secondPersonSingular":
        return "ec re " + verb.substring(0, verb.length - 2) + "u7cw";

      case "thirdPerson":
        return "ec re " + verb.substring(0, verb.length - 2) + "u7s";
      case "firstPersonPluralInc":
        return "ec re " + verb.substring(0, verb.length - 2) + "u7t";
      case "firstPersonPluralExc":
        return "ec re " + verb.substring(0, verb.length - 2) + "u7s kucw";
      case "secondPersonPlural":
        return "ec re " + verb.substring(0, verb.length - 2) + "u7p";
    }
    return "something went wrong";
  };

  const endInOthers = (verb: string) => {
    switch (perspective) {
      case "firstPersonSingular":
        return handleFirstPersonSingular(verb);
      case "secondPersonSingular":
        return "ec re " + verb + "ecw";
      case "thirdPerson":
        return "ec re " + verb + "es";
      case "firstPersonPluralInc":
        return "ec re " + verb + "et";
      case "firstPersonPluralExc":
        return "ec re " + verb + "es kucw";
      case "secondPersonPlural":
        return "ec re " + verb + "ep";
    }
    return "something went wrong";
  };

  return (
    <div className="convert">
      <h1 className="convert__heading">
        This program attempts to show the progressive forms of intransitive
        Secwepemctsín verbs.
      </h1>
      <h2>Choose the perspective.</h2>
      <select
        className="convert__select"
        value={perspective}
        onChange={(e) => handleChange(e)}
        name=""
        id=""
      >
        <option value="firstPersonSingular">First Person Singular</option>
        <option value="secondPersonSingular">Second Person Singular</option>
        <option value="thirdPerson">Third Person</option>
        <option value="firstPersonPluralInc">
          First Person Plural Inclusive
        </option>
        <option value="firstPersonPluralExc">
          First Person Plural Exclusive
        </option>
        <option value="secondPersonPlural">Second Person Plural</option>
      </select>
      <h2>Do you want to reduplicate first person singular?</h2>
      <form className="convert__radio" action="">
        <label htmlFor="">
          Yes
          <input
            type="radio"
            checked={reduplicate}
            onChange={() => handleReduplicate(true)}
          />
        </label>

        <label htmlFor="">
          No
          <input
            type="radio"
            checked={!reduplicate}
            onChange={() => handleReduplicate(false)}
          />
        </label>
      </form>

      <h3>Example Verbs</h3>
      <p>Click the buttons below to get their outputs directly</p>

      <button onClick={() => handleSubmit("elkst")}>elkst - to work</button>
      <button onClick={() => handleSubmit("t̓7ek")}>t̓7ek - to go</button>
      <button onClick={() => handleSubmit("séyse")}>séyse - to play</button>
      <button
        className="convert__last-verb"
        onClick={() => handleSubmit("sécwle7")}
      >
        sécwle7 - to bathe one's baby
      </button>
      <h2>Or</h2>
      <p>Enter another verb and then click the "Get output" button</p>
      <form action="">
        <input
          value={customVerb}
          onChange={(e) => setCustomVerb(e.target.value)}
          type="text"
          placeholder="Enter another verb"
        />
      </form>
      <button onClick={() => handleSubmit(customVerb)}>Get output</button>
      {/* <p>Output: </p> */}
      <p className="convert__output">{output}</p>
    </div>
  );
}

export default App;
