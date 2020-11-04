import React from "react";
import "./AvatarImage.css";

export default function AvatarImage({ avatarUrl, entity }: { avatarUrl?: string, entity: any}) {
  if (avatarUrl) return <img className="avatar-image" src={avatarUrl} alt={entity.displayName} />
  if (!entity) return (<></>)
  const title = entity.displayName
  .split(' ')
  .slice(0,2)
  .map((x: string) => x.slice(0,1).toUpperCase())
  .join('')
  return (<div className={`avatar-image type-${entity.$entityType}`}> {title} </div>)
}
