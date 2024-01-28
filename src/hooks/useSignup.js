import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, timestamp } from "../firebase/config";
import { useFirestore } from "./useFirestore";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const { updateDocument } = useFirestore("users");
  const { addDocument: addTeam } = useFirestore("teams");

  const signup = async (email, password, name) => {
    setError(null);
    setIsPending(true);

    try {
      // Sign up user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        setIsPending(false);
        throw new Error("Não foi possível realizar o cadastro.");
      }

      // Add display name to user
      await updateProfile(auth.currentUser, { displayName: name });
      await updateProfile(res.user, { displayName: name });

      // Create a user document
      const createdAt = timestamp;

      // const { payload: teamId } = await addTeam({
      //   name: `${name}'s Team`,
      //   createdAt,
      //   participants: [res.user.uid],
      // });


      //Caso queria que assim que for criado um usuário um novo
      //time seja criado, é só descomentar a linha de código abaixo

      // const res2 = await addTeam({
      //   tags: [],
      //   "column-1": [],
      //   "column-2": [],
      //   "column-3": [],
      //   "column-4": [],
      // });


      //Coloquei um id fixe para um team fixo
      const teamId = "UQILt7zyBzSOby3mYgxV";

      setDoc(doc(db, "users", res.user.uid), {
        id: res.user.uid,
        online: true,
        createdAt,
        email: email,
        name: name,
        teamId: teamId,
      });

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      // Update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => () => setIsCancelled(true), []);

  return { error, isPending, signup };
};
