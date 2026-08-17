"use client";

import { FolioMast } from "@/components/FolioMast";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { ProfileComposer } from "@/components/ProfileComposer";
import { kindPhrase } from "@/lib/profile";
import { useActorSession } from "@/lib/useActorSession";

export function ProfilesDesk() {
  const {
    session,
    actor,
    become,
    leave,
    handleCreate,
    handleSetImage,
  } = useActorSession();

  const people = session?.users.filter((user) => user.kind === "person") ?? [];
  const agents = session?.users.filter((user) => user.kind === "agent") ?? [];

  return (
    <>
      <FolioMast
        current="profiles"
        actor={actor}
        onLeave={session ? leave : undefined}
        onSetImage={session && actor ? handleSetImage : undefined}
      />
      <div className="issue-stage is-single">
        <article className="issue">
          <header className="folio-head">
            <p className="folio-issue">Who files a reading</p>
            <h1 className="folio-title">Profiles</h1>
            <p className="folio-by">People, and labelled agents</p>
            <p className="folio-dek">
              A person interprets. An agent profile is a named model voice you
              can file a reading as. It is not a chat, and it is not evidence.
              Click the plate for a new gradient. Add a photo if you have one.
            </p>
          </header>

          {session ? (
            <div id="login">
              <ProfileComposer variant="page" onCreate={handleCreate} />
            </div>
          ) : (
            <p className="quiet">Loading profiles…</p>
          )}

          <section className="profile-group" aria-label="People">
            <p className="kicker">People</p>
            <ul className="profile-list">
              {people.map((user) => (
                <li key={user.id}>
                  <ProfileAvatar user={user} size="l" />
                  <div>
                    <strong>{user.name}</strong>
                    <p>{kindPhrase(user)}</p>
                  </div>
                  {actor?.id === user.id ? (
                    <span className="profile-you">You</span>
                  ) : (
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => become(user)}
                    >
                      Enter as {user.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="profile-group" aria-label="Agents">
            <p className="kicker">Agents</p>
            {agents.length === 0 ? (
              <p className="quiet">
                None yet. Create one above. A reading filed as an agent stays a
                reading.
              </p>
            ) : (
              <ul className="profile-list">
                {agents.map((user) => (
                  <li key={user.id}>
                    <ProfileAvatar user={user} size="l" />
                    <div>
                      <strong>{user.name}</strong>
                      <p>
                        {kindPhrase(user)}
                        {user.note ? ` · ${user.note}` : ""}
                      </p>
                    </div>
                    {actor?.id === user.id ? (
                      <span className="profile-you">You</span>
                    ) : (
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => become(user)}
                      >
                        Enter as {user.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </article>
      </div>
    </>
  );
}
