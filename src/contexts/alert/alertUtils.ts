
import { Alert } from "@/types";

/**
 * Plays an alert sound based on the alert type
 */
export const playAlertSound = (type: Alert['type'], setAlertSound: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>) => {
  stopAlertSound(setAlertSound);
  
  // Select sound URL based on alert type
  let soundUrl = "";
  
  switch (type) {
    case "panic":
      soundUrl = "/sounds/panic-alarm.mp3";
      break;
    case "emergency":
      soundUrl = "/sounds/emergency-alarm.mp3";
      break;
    case "patrol_stop":
      soundUrl = "/sounds/notification.mp3";
      break;
    case "system":
      soundUrl = "/sounds/system-alert.mp3";
      break;
    default:
      soundUrl = "/sounds/notification.mp3";
  }
  
  // In real app, these sound files would be created and added
  // For now we'll just log it
  console.log(`Playing alarm sound for ${type} alert (${soundUrl})`);
  
  // Create and play sound - would work if sound files were available
  const sound = new Audio(soundUrl);
  sound.loop = type === "panic" || type === "emergency";
  sound.play().catch(e => console.log("Sound not available:", e));
  
  setAlertSound(sound);
};

/**
 * Stops the currently playing alert sound
 */
export const stopAlertSound = (setAlertSound: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>) => {
  setAlertSound(prev => {
    if (prev) {
      prev.pause();
      prev.currentTime = 0;
    }
    return null;
  });
};
